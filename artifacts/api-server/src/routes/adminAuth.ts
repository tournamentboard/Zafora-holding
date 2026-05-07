import { Router } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_PASSWORD = "zafora2024";

async function getAdminPassword(): Promise<string> {
  try {
    const [row] = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, "admin_password"))
      .limit(1);
    if (row?.value) return row.value;
  } catch {}
  return DEFAULT_PASSWORD;
}

async function setAdminPassword(password: string): Promise<void> {
  const existing = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, "admin_password"))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(siteSettingsTable)
      .set({ value: password, updatedAt: new Date() })
      .where(eq(siteSettingsTable.key, "admin_password"));
  } else {
    await db.insert(siteSettingsTable).values({ key: "admin_password", value: password });
  }
}

router.get("/admin/auth/check", (req, res) => {
  const session = req.session as any;
  res.json({ authenticated: session.adminAuthenticated === true });
});

router.post("/admin/auth/login", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password required" });
    return;
  }
  const storedPassword = await getAdminPassword();
  if (password !== storedPassword) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  const session = req.session as any;
  session.adminAuthenticated = true;
  res.json({ ok: true });
});

router.post("/admin/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.post("/admin/auth/change-password", async (req, res) => {
  const session = req.session as any;
  if (!session.adminAuthenticated) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both current and new password required" });
    return;
  }
  const storedPassword = await getAdminPassword();
  if (currentPassword !== storedPassword) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters" });
    return;
  }
  await setAdminPassword(newPassword);
  res.json({ ok: true });
});

export default router;
