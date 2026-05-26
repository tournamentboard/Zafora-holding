import { pgTable, text, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentStatsTable = pgTable("content_stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull().unique(),
  value: text("value").notNull(),
  suffix: text("suffix"),
  description: text("description"),
  iconName: text("icon_name"),
  displayOrder: integer("display_order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
});

export const insertContentStatSchema = createInsertSchema(contentStatsTable).omit({ id: true });
export type InsertContentStat = z.infer<typeof insertContentStatSchema>;
export type ContentStat = typeof contentStatsTable.$inferSelect;
