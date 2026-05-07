import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

const DEFAULT_TESTIMONIALS = [
  {
    name: "Minister of Infrastructure",
    company: "West African Federal Government",
    role: "Cabinet Minister",
    quote: "Zafora's advisory team brought clarity to a complex cross-border energy project that had stalled for years. Within 12 months we had a bankable structure and committed capital.",
    photoUrl: null,
    displayOrder: 0,
    visible: true,
  },
  {
    name: "Managing Director",
    company: "Pan-African Infrastructure Fund",
    role: "Institutional Investor",
    quote: "What sets Zafora apart is their ability to bridge the gap between government vision and investor expectations. They speak both languages fluently.",
    photoUrl: null,
    displayOrder: 1,
    visible: true,
  },
];

router.get("/testimonials", async (_req, res) => {
  let testimonials = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.displayOrder));
  if (testimonials.length === 0) {
    await db.insert(testimonialsTable).values(DEFAULT_TESTIMONIALS);
    testimonials = await db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.displayOrder));
  }
  res.json({ testimonials });
});

router.post("/testimonials", async (req, res) => {
  const body = req.body as any;
  const [item] = await db.insert(testimonialsTable).values({
    name: body.name,
    company: body.company,
    role: body.role ?? null,
    quote: body.quote,
    photoUrl: body.photoUrl ?? null,
    displayOrder: body.displayOrder ?? 0,
    visible: body.visible ?? true,
  }).returning();
  res.status(201).json(item);
});

router.patch("/testimonials/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [item] = await db.update(testimonialsTable).set({
    ...(body.name !== undefined && { name: body.name }),
    ...(body.company !== undefined && { company: body.company }),
    ...(body.role !== undefined && { role: body.role }),
    ...(body.quote !== undefined && { quote: body.quote }),
    ...(body.photoUrl !== undefined && { photoUrl: body.photoUrl }),
    ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    ...(body.visible !== undefined && { visible: body.visible }),
  }).where(eq(testimonialsTable.id, id)).returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete("/testimonials/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
  res.status(204).send();
});

export default router;
