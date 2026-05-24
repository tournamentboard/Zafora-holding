import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import { CreateDocumentBody, UpdateDocumentBody, ListDocumentsQuery } from "./documents.validator.js";
import { listDocuments, createDocument, updateDocument, deleteDocument } from "./documents.service.js";

const router = Router();

// B5 — all document routes are admin-protected
router.get(ROUTE_PATHS.DOCUMENTS.LIST, requireAuth, async (req, res) => {
  const parsed = ListDocumentsQuery.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid query params" }); return; }
  const result = await listDocuments(parsed.data);
  res.json(result);
});

router.post(ROUTE_PATHS.DOCUMENTS.LIST, requireAuth, async (req, res) => {
  const parsed = CreateDocumentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const doc = await createDocument(parsed.data);
  res.status(201).json(doc);
});

router.patch(ROUTE_PATHS.DOCUMENTS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateDocumentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const doc = await updateDocument(id, parsed.data);
  if (!doc) { res.status(404).json({ error: "Not found" }); return; }
  res.json(doc);
});

router.delete(ROUTE_PATHS.DOCUMENTS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteDocument(id);
  res.status(204).send();
});

export default router;
