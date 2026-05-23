import { Router } from "express";
import { isEmailConfigured, sendTestEmail } from "../email.js";

const router = Router();

router.get("/email/status", (_req, res) => {
  res.json({ configured: isEmailConfigured() });
});

router.post("/email/test", async (req, res) => {
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
