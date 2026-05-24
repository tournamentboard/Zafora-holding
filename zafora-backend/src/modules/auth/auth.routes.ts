import { Router } from "express";
import { LoginBody, ChangePasswordBody } from "./auth.validator.js";
import {
  validateCredentials,
  setSessionUser,
  verifySession,
  changePassword,
  getSessionUser,
} from "./auth.service.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";

const router = Router();

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

  setSessionUser(req.session as unknown as Record<string, unknown>, {
    userId: user.userId,
    email: user.email,
    role: user.role,
  });

  res.json({ ok: true, user: { id: user.userId, email: user.email, role: user.role } });
});

router.get(ROUTE_PATHS.AUTH.VERIFY, (req, res) => {
  const result = verifySession(req.session as unknown as Record<string, unknown>);
  res.json(result);
});

router.post(ROUTE_PATHS.AUTH.LOGOUT, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.post(ROUTE_PATHS.AUTH.CHANGE_PASSWORD, async (req, res) => {
  const sessionUser = getSessionUser(req.session as unknown as Record<string, unknown>);
  if (!sessionUser) {
    res.status(401).json({ error: "Not authenticated" });
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

  res.json({ ok: true });
});

export default router;
