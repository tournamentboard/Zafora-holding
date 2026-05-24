import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sector: text("sector").notNull(),
  country: text("country").notNull(),
  region: text("region"),
  fundingStatus: text("funding_status").notNull().default("seeking_funding"),
  estimatedValue: text("estimated_value").notNull(),
  zaforaRole: text("zafora_role").notNull(),
  partnerNeed: text("partner_need"),
  description: text("description"),
  imageUrl: text("image_url"),
  interestCount: integer("interest_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
