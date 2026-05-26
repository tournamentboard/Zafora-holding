import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@/db/index.js";
import { LoginBody, ChangePasswordBody, SetupBody, ResetPasswordBody } from "./auth.validator.js";
import {
  validateCredentials,
  findRefreshToken,
  storeRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens,
  changePassword,
  hasAdminUser,
  createUser,
  hashPassword,
  findUserByEmail,
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

// POST /api/auth/login — password only; email resolved from ADMIN_EMAIL env
router.post(ROUTE_PATHS.AUTH.LOGIN, async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password is required" });
    return;
  }

  const adminEmail = process.env["ADMIN_EMAIL"];
  if (!adminEmail) {
    res.status(503).json({ error: "ADMIN_EMAIL is not configured on this server." });
    return;
  }

  const user = await validateCredentials(adminEmail, parsed.data.password);
  if (!user) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const tokenPayload = { userId: user.userId, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const { token: refreshToken, tokenId, expiresAt } = generateRefreshToken(tokenPayload);

  await storeRefreshToken(tokenId, user.userId, expiresAt);

  res.cookie(ACCESS_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);

  res.json({ ok: true, accessToken, refreshToken, user: { id: user.userId, email: user.email, role: user.role } });
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
  // Accept token from request body (localStorage flow) or cookie (SSR flow)
  const token: string | undefined =
    (req.body as { refreshToken?: string })?.refreshToken ||
    req.cookies?.[REFRESH_COOKIE];
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

  res.json({ ok: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
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

// GET /api/auth/setup-status — check if initial admin account exists
router.get(ROUTE_PATHS.AUTH.SETUP_STATUS, async (_req, res) => {
  const required = !(await hasAdminUser());
  res.json({ required });
});

// POST /api/auth/setup — first-time admin account creation
router.post(ROUTE_PATHS.AUTH.SETUP, async (req, res) => {
  const ADMIN_SETUP_EMAIL = process.env["ADMIN_SETUP_EMAIL"];
  if (!ADMIN_SETUP_EMAIL) {
    res.status(503).json({ error: "ADMIN_SETUP_EMAIL is not configured on this server." });
    return;
  }

  if (await hasAdminUser()) {
    res.status(403).json({ error: "Setup is already complete. Use change-password to update credentials." });
    return;
  }

  const parsed = SetupBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }

  const { adminEmail, newPassword, confirmPassword } = parsed.data;
  if (adminEmail !== ADMIN_SETUP_EMAIL) {
    res.status(403).json({ error: "Unauthorized. Email does not match the authorized admin email." });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const userId = await createUser(adminEmail, newPassword, "admin");

  // Auto-login: issue JWT cookies so the admin lands directly in the panel
  const tokenPayload = { userId, email: adminEmail, role: "admin" };
  const accessToken = generateAccessToken(tokenPayload);
  const { token: refreshToken, tokenId, expiresAt } = generateRefreshToken(tokenPayload);
  await storeRefreshToken(tokenId, userId, expiresAt);

  res.cookie(ACCESS_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  res.cookie(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);

  res.json({ ok: true, accessToken, refreshToken, user: { id: userId, email: adminEmail, role: "admin" } });
});

// POST /api/auth/reset-password — emergency reset (for locked out admin)
router.post(ROUTE_PATHS.AUTH.RESET_PASSWORD, async (req, res) => {
  const ADMIN_SETUP_EMAIL = process.env["ADMIN_SETUP_EMAIL"];
  if (!ADMIN_SETUP_EMAIL) {
    res.status(503).json({ error: "Password reset is not configured on this server." });
    return;
  }

  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }

  const { adminEmail, newPassword, confirmPassword } = parsed.data;
  if (adminEmail !== ADMIN_SETUP_EMAIL) {
    res.status(403).json({ error: "Unauthorized. Email does not match the authorized admin email." });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const user = await findUserByEmail(adminEmail);
  if (!user) {
    res.status(404).json({ error: "No admin account found. Use /auth/setup to create one." });
    return;
  }

  const passwordHash = await hashPassword(newPassword);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, user.id));
  await deleteAllUserTokens(user.id);

  res.json({ ok: true });
});

export default router;
