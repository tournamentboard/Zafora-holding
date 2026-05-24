import { Router } from "express";
import { LoginBody, ChangePasswordBody } from "./auth.validator.js";
import {
  validateCredentials,
  findRefreshToken,
  storeRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens,
  changePassword,
} from "./auth.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
  clearAuthCookies,
} from "./auth.tokens.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
const router = Router();

// POST /api/auth/login
router.post(ROUTE_PATHS.AUTH.LOGIN, async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const user = await validateCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const tokenPayload = { userId: user.userId, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const { token: refreshToken, tokenId, expiresAt } = generateRefreshToken(tokenPayload);

  await storeRefreshToken(tokenId, user.userId, expiresAt);

  res.cookie(ACCESS_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);

  res.json({ ok: true, user: { id: user.userId, email: user.email, role: user.role } });
});

// GET /api/auth/verify
router.get(ROUTE_PATHS.AUTH.VERIFY, (req, res) => {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.json({ authenticated: false });
    return;
  }

  res.json({
    authenticated: true,
    user: { id: payload.userId, email: payload.email, role: payload.role },
  });
});

// POST /api/auth/refresh
router.post(ROUTE_PATHS.AUTH.REFRESH, async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "No refresh token" });
    return;
  }

  const payload = verifyRefreshToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }

  const stored = await findRefreshToken(payload.tokenId);
  if (!stored || stored.expiresAt < new Date()) {
    clearAuthCookies(res);
    res.status(401).json({ error: "Refresh token revoked or expired" });
    return;
  }

  // Rotate: delete old token, issue new pair
  await deleteRefreshToken(payload.tokenId);

  const tokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const {
    token: newRefreshToken,
    tokenId: newTokenId,
    expiresAt,
  } = generateRefreshToken(tokenPayload);

  await storeRefreshToken(newTokenId, payload.userId, expiresAt);

  res.cookie(ACCESS_COOKIE, newAccessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE, newRefreshToken, REFRESH_COOKIE_OPTIONS);

  res.json({ ok: true });
});

// POST /api/auth/logout
router.post(ROUTE_PATHS.AUTH.LOGOUT, async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;
  if (token) {
    const payload = verifyRefreshToken(token);
    if (payload) {
      await deleteRefreshToken(payload.tokenId).catch(() => undefined);
    }
  }

  clearAuthCookies(res);
  res.json({ ok: true });
});

// POST /api/auth/change-password
router.post(ROUTE_PATHS.AUTH.CHANGE_PASSWORD, async (req, res) => {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const sessionUser = verifyAccessToken(token);
  if (!sessionUser) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const parsed = ChangePasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const result = await changePassword(
    sessionUser.userId,
    parsed.data.currentPassword,
    parsed.data.newPassword,
  );

  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  // Invalidate all refresh tokens for this user after password change
  await deleteAllUserTokens(sessionUser.userId);
  clearAuthCookies(res);

  res.json({ ok: true });
});

export default router;
