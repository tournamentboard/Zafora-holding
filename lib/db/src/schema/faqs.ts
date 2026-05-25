import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").default("general"),
  page: text("page").default("general"),
  displayOrder: integer("display_order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Faq = typeof faqsTable.$inferSelect;
export type InsertFaq = typeof faqsTable.$inferInsert;
