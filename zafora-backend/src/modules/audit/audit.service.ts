import { desc } from "drizzle-orm";
import { db, auditLogsTable } from "@/db/index.js";

export async function logAction(
  action: string,
  category: string,
  description: string,
  detail?: Record<string, unknown>,
): Promise<void> {
  try {
    await db.insert(auditLogsTable).values({ action, category, description, detail: detail ?? null });
  } catch {
    // fire-and-forget; never block request
  }
}

export async function listAuditLogs(limit: number) {
  return db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.performedAt)).limit(limit);
}

export async function clearAuditLogs(): Promise<void> {
  await db.delete(auditLogsTable);
}
