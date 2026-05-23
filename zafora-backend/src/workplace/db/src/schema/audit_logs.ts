import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  detail: jsonb("detail"),
  performedAt: timestamp("performed_at").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogsTable.$inferSelect;
export type NewAuditLog = typeof auditLogsTable.$inferInsert;
