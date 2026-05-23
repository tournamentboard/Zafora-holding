import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const SALT_ROUNDS = 12;
const ADMIN_SETUP_EMAIL = process.env.ADMIN_SETUP_EMAIL;

// ── Helpers ──────────────────────────────────────────────────────────

async function getPasswordHash(): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, "admin_password"))
      .limit(1);
    // Only return value if it's a bcrypt hash (starts with $2a/$2b/$2y)
    if (row?.value && row.value.startsWith("$2")) return row.value;
  } catch {}
  return null;
}

async function storePasswordHash(hash: string): Promise<void> {
  const existing = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, "admin_password"))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(siteSettingsTable)
      .set({ value: hash, updatedAt: new Date() })
      .where(eq(siteSettingsTable.key, "admin_password"));
  } else {
    await db.insert(siteSettingsTable).values({ key: "admin_password", value: hash });
  }
}

// ── Routes ───────────────────────────────────────────────────────────

// Returns whether a password has been set (drives first-time setup UI)
router.get("/admin/auth/setup-status", async (_req, res) => {
  const hash = await getPasswordHash();
  res.json({ required: hash === null });
});

// First-time password setup — only works when no password is stored
// Requires adminEmail to match the ADMIN_SETUP_EMAIL environment variable
router.post("/admin/auth/setup", async (req, res) => {
  const hash = await getPasswordHash();
  if (hash !== null) {
    res.status(403).json({ error: "Setup is already complete. Use change-password to update." });
    return;
  }

  if (!ADMIN_SETUP_EMAIL) {
    res.status(503).json({
      error: "ADMIN_SETUP_EMAIL is not configured. Set this environment variable on your server to enable first-time setup.",
    });
    return;
  }

  const { adminEmail, newPassword, confirmPassword } = req.body;

  if (!adminEmail || adminEmail !== ADMIN_SETUP_EMAIL) {
    res.status(403).json({ error: "Unauthorized. The email address provided does not match the authorized admin email." });
    return;
  }

  if (!newPassword || typeof newPassword !== "string") {
    res.status(400).json({ error: "Password is required." });
    return;
  }
  if (newPassword.length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters." });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await storePasswordHash(newHash);
  res.json({ ok: true });
});

// Check if session is authenticated
router.get("/admin/auth/check", (req, res) => {
  const session = req.session as any;
  res.json({ authenticated: session.adminAuthenticated === true });
});

// Login — compares against bcrypt hash; no fallback if no password is set
router.post("/admin/auth/login", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password required." });
    return;
  }

  const hash = await getPasswordHash();
  if (!hash) {
    res.status(403).json({ error: "No password set. Please complete first-time setup.", setupRequired: true });
    return;
  }

  const match = await bcrypt.compare(String(password), hash);
  if (!match) {
    res.status(401).json({ error: "Incorrect password." });
    return;
  }

  const session = req.session as any;
  session.adminAuthenticated = true;
  res.json({ ok: true });
});

// Logout
router.post("/admin/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Change password (requires active session + correct current password)
router.post("/admin/auth/change-password", async (req, res) => {
  const session = req.session as any;
  if (!session.adminAuthenticated) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both current and new password are required." });
    return;
  }

  const hash = await getPasswordHash();
  if (!hash) {
    res.status(403).json({ error: "No password set. Please complete first-time setup.", setupRequired: true });
    return;
  }

  const match = await bcrypt.compare(String(currentPassword), hash);
  if (!match) {
    res.status(401).json({ error: "Current password is incorrect." });
    return;
  }

  if (newPassword.length < 4) {
    res.status(400).json({ error: "New password must be at least 4 characters." });
    return;
  }
  if (confirmPassword && newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const newHash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
  await storePasswordHash(newHash);
  res.json({ ok: true });
});

// Password reset — for when admin is locked out.
// Requires knowing the ADMIN_SETUP_EMAIL (acts as identity verification).
// After reset, the old session remains valid only if not destroyed.
router.post("/admin/auth/reset-password", async (req, res) => {
  if (!ADMIN_SETUP_EMAIL) {
    res.status(503).json({ error: "Password reset is not configured on this server." });
    return;
  }

  const { adminEmail, newPassword, confirmPassword } = req.body;

  if (!adminEmail || adminEmail !== ADMIN_SETUP_EMAIL) {
    res.status(403).json({ error: "Unauthorized. Email does not match the authorized admin email." });
    return;
  }

  if (!newPassword || typeof newPassword !== "string") {
    res.status(400).json({ error: "New password is required." });
    return;
  }
  if (newPassword.length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters." });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match." });
    return;
  }

  const newHash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
  await storePasswordHash(newHash);
  res.json({ ok: true });
});

export default router;
