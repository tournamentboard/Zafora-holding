import { Router } from "express";
import { db, auditLogsTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

const router = Router();

router.get("/audit", async (req, res) => {
  const limit = Math.min(parseInt((req.query.limit as string) ?? "50"), 200);
  const logs = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.performedAt)).limit(limit);
  res.json({ logs });
});

router.delete("/audit", async (_req, res) => {
  await db.delete(auditLogsTable);
  res.status(204).send();
});

export default router;

export async function logAction(
  action: string,
  category: string,
  description: string,
  detail?: Record<string, unknown>,
) {
  try {
    await db.insert(auditLogsTable).values({ action, category, description, detail: detail ?? null });
  } catch {
    // fire-and-forget; never block request
  }
}
