import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { isEmailConfigured, sendTestEmail } from "@/shared/lib/email.js";

const router = Router();

// B5 — protected: notification config
router.get(ROUTE_PATHS.NOTIFICATIONS.STATUS, requireAuth, (_req, res) => {
  res.json({ configured: isEmailConfigured() });
});

router.post(ROUTE_PATHS.NOTIFICATIONS.SEND_TEST, requireAuth, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) { res.status(400).json({ error: "email is required" }); return; }
  const result = await sendTestEmail(email);
  if (result.ok) {
    res.json({ ok: true });
  } else {
    res.status(500).json({ ok: false, error: result.error });
  }
});

export default router;
