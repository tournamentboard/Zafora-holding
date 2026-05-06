import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable).orderBy(asc(servicesTable.displayOrder));
  res.json({ services });
});

router.post("/services", async (req, res) => {
  const body = req.body as any;
  const [service] = await db.insert(servicesTable).values({
    name: body.name,
    icon: body.icon ?? "Briefcase",
    description: body.description,
    bullets: Array.isArray(body.bullets) ? body.bullets : [],
    imageUrl: body.imageUrl ?? null,
    category: body.category ?? null,
    displayOrder: body.displayOrder ?? 0,
    visible: body.visible ?? true,
  }).returning();
  res.status(201).json(service);
});

router.patch("/services/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [service] = await db.update(servicesTable).set({
    ...(body.name !== undefined && { name: body.name }),
    ...(body.icon !== undefined && { icon: body.icon }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.bullets !== undefined && { bullets: Array.isArray(body.bullets) ? body.bullets : [] }),
    ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
    ...(body.category !== undefined && { category: body.category }),
    ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    ...(body.visible !== undefined && { visible: body.visible }),
  }).where(eq(servicesTable.id, id)).returning();
  if (!service) { res.status(404).json({ error: "Not found" }); return; }
  res.json(service);
});

router.delete("/services/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.status(204).send();
});

export default router;
