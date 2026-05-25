import { eq, asc } from "drizzle-orm";
import { db, faqsTable } from "@/db/index.js";
import { logAction } from "@/modules/audit/index.js";
import type { CreateFaqBodyType, UpdateFaqBodyType } from "./faqs.validator.js";

export async function listFaqs() {
  return db.select().from(faqsTable).orderBy(asc(faqsTable.displayOrder));
}

export async function createFaq(data: CreateFaqBodyType) {
  const [faq] = await db.insert(faqsTable).values({
    question: data.question,
    answer: data.answer,
    category: data.category,
    page: data.page,
    displayOrder: data.displayOrder,
    visible: data.visible,
  }).returning();

  logAction("create", "Content", `FAQ created: "${data.question.slice(0, 60)}"`, { faqId: faq!.id }).catch(() => {});
  return faq!;
}

export async function updateFaq(id: number, data: UpdateFaqBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.question !== undefined) updates["question"] = data.question;
  if (data.answer !== undefined) updates["answer"] = data.answer;
  if (data.category !== undefined) updates["category"] = data.category;
  if (data.page !== undefined) updates["page"] = data.page;
  if (data.displayOrder !== undefined) updates["displayOrder"] = data.displayOrder;
  if (data.visible !== undefined) updates["visible"] = data.visible;

  const [faq] = await db.update(faqsTable).set(updates).where(eq(faqsTable.id, id)).returning();
  if (!faq) return null;
  logAction("update", "Content", `FAQ updated: "${faq.question.slice(0, 60)}"`, { faqId: id }).catch(() => {});
  return faq;
}

export async function deleteFaq(id: number) {
  await db.delete(faqsTable).where(eq(faqsTable.id, id));
  logAction("delete", "Content", `FAQ #${id} deleted`, { faqId: id }).catch(() => {});
}
