import { eq, asc } from "drizzle-orm";
import { db, testimonialsTable } from "@/db/index.js";
import { logAction } from "@/modules/audit/index.js";
import type { CreateTestimonialBodyType, UpdateTestimonialBodyType } from "./testimonials.validator.js";

const DEFAULT_TESTIMONIALS = [
  { name: "Minister of Infrastructure", company: "West African Federal Government", role: "Cabinet Minister", quote: "Zafora's advisory team brought clarity to a complex cross-border energy project that had stalled for years. Within 12 months we had a bankable structure and committed capital.", photoUrl: null, displayOrder: 0, visible: true },
  { name: "Managing Director", company: "Pan-African Infrastructure Fund", role: "Institutional Investor", quote: "What sets Zafora apart is their ability to bridge the gap between government vision and investor expectations. They speak both languages fluently.", photoUrl: null, displayOrder: 1, visible: true },
];

export async function listTestimonials() {
  let testimonials = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.displayOrder));
  if (testimonials.length === 0) {
    await db.insert(testimonialsTable).values(DEFAULT_TESTIMONIALS);
    testimonials = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.displayOrder));
  }
  return testimonials;
}

export async function createTestimonial(data: CreateTestimonialBodyType) {
  const [item] = await db.insert(testimonialsTable).values({
    name: data.name,
    company: data.company,
    role: data.role ?? null,
    quote: data.quote,
    photoUrl: data.photoUrl ?? null,
    displayOrder: data.displayOrder,
    visible: data.visible,
  }).returning();

  logAction("create", "Content", `Testimonial created: "${data.name}"`, { testimonialId: item!.id }).catch(() => {});
  return item!;
}

export async function updateTestimonial(id: number, data: UpdateTestimonialBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates["name"] = data.name;
  if (data.company !== undefined) updates["company"] = data.company;
  if (data.role !== undefined) updates["role"] = data.role;
  if (data.quote !== undefined) updates["quote"] = data.quote;
  if (data.photoUrl !== undefined) updates["photoUrl"] = data.photoUrl;
  if (data.displayOrder !== undefined) updates["displayOrder"] = data.displayOrder;
  if (data.visible !== undefined) updates["visible"] = data.visible;

  const [item] = await db.update(testimonialsTable).set(updates).where(eq(testimonialsTable.id, id)).returning();
  if (!item) return null;
  logAction("update", "Content", `Testimonial updated: "${item.name}"`, { testimonialId: id }).catch(() => {});
  return item;
}

export async function deleteTestimonial(id: number) {
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
  logAction("delete", "Content", `Testimonial #${id} deleted`, { testimonialId: id }).catch(() => {});
}
