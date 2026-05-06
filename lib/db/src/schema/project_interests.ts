import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectInterestsTable = pgTable("project_interests", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  fullName: text("full_name").notNull(),
  organization: text("organization").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  roleType: text("role_type").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProjectInterestSchema = createInsertSchema(projectInterestsTable).omit({ id: true, createdAt: true });
export type InsertProjectInterest = z.infer<typeof insertProjectInterestSchema>;
export type ProjectInterest = typeof projectInterestsTable.$inferSelect;
