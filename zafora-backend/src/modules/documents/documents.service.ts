import { eq, desc, count } from "drizzle-orm";
import { db, documentsTable } from "@/db/index.js";
import { logAction } from "@/modules/audit/index.js";
import type { CreateDocumentBodyType, UpdateDocumentBodyType, ListDocumentsQueryType } from "./documents.validator.js";

export async function listDocuments(query: ListDocumentsQueryType) {
  const { visibility, page, limit } = query;
  const offset = (page - 1) * limit;
  const where = visibility ? eq(documentsTable.visibility, visibility) : undefined;

  const [documents, totalResult] = await Promise.all([
    db.select().from(documentsTable).where(where).orderBy(desc(documentsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(documentsTable).where(where),
  ]);

  return { documents, total: totalResult[0]?.count ?? 0 };
}

export async function getDocumentById(id: number) {
  const [doc] = await db.select().from(documentsTable).where(eq(documentsTable.id, id)).limit(1);
  return doc ?? null;
}

export async function createDocument(data: CreateDocumentBodyType) {
  const [doc] = await db.insert(documentsTable).values({
    title: data.title,
    documentType: data.documentType,
    visibility: data.visibility,
    fileUrl: data.fileUrl ?? null,
    description: data.description ?? null,
  }).returning();

  logAction("create", "Documents", `Document created: "${data.title}"`, { docId: doc!.id }).catch(() => {});
  return doc!;
}

export async function updateDocument(id: number, data: UpdateDocumentBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates["title"] = data.title;
  if (data.documentType !== undefined) updates["documentType"] = data.documentType;
  if (data.visibility !== undefined) updates["visibility"] = data.visibility;
  if (data.fileUrl !== undefined) updates["fileUrl"] = data.fileUrl ?? null;
  if (data.description !== undefined) updates["description"] = data.description ?? null;

  const [doc] = await db.update(documentsTable).set(updates).where(eq(documentsTable.id, id)).returning();
  if (!doc) return null;

  logAction("update", "Documents", `Document updated: "${doc.title}"`, { docId: id }).catch(() => {});
  return doc;
}

export async function deleteDocument(id: number) {
  const [doc] = await db.select({ title: documentsTable.title }).from(documentsTable).where(eq(documentsTable.id, id));
  await db.delete(documentsTable).where(eq(documentsTable.id, id));
  logAction("delete", "Documents", `Document deleted: "${doc?.title ?? `#${id}`}"`, { docId: id }).catch(() => {});
}
