import { Router } from "express";
import { db, documentsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";
import { CreateDocumentBody, ListDocumentsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/documents", async (req, res) => {
  const parsed = ListDocumentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { visibility } = parsed.data;
  const where = visibility ? eq(documentsTable.visibility, visibility) : undefined;

  const [documents, totalResult] = await Promise.all([
    db.select().from(documentsTable).where(where).orderBy(desc(documentsTable.createdAt)),
    db.select({ count: count() }).from(documentsTable).where(where),
  ]);

  res.json({ documents, total: totalResult[0]?.count ?? 0 });
});

router.post("/documents", async (req, res) => {
  const parsed = CreateDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }
  const data = parsed.data;
  const [doc] = await db.insert(documentsTable).values({
    title: data.title,
    documentType: data.documentType,
    visibility: data.visibility,
    fileUrl: data.fileUrl ?? null,
    description: data.description ?? null,
  }).returning();
  res.status(201).json(doc);
});

router.delete("/documents/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(documentsTable).where(eq(documentsTable.id, id));
  res.status(204).send();
});

export default router;
