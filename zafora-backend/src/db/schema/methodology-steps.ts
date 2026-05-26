import { pgTable, text, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const methodologyStepsTable = pgTable("methodology_steps", {
  id: serial("id").primaryKey(),
  stepNumber: integer("step_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name"),
  displayOrder: integer("display_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertMethodologyStepSchema = createInsertSchema(methodologyStepsTable).omit({ id: true });
export type InsertMethodologyStep = z.infer<typeof insertMethodologyStepSchema>;
export type MethodologyStep = typeof methodologyStepsTable.$inferSelect;
