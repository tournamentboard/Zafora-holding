import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import { CreateFaqBody, UpdateFaqBody } from "./faqs.validator.js";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "./faqs.service.js";

const router = Router();

// public: list FAQs
router.get(ROUTE_PATHS.CONTENT.FAQS, async (_req, res) => {
  const faqs = await listFaqs();
  res.json({ faqs });
});

// protected: create
router.post(ROUTE_PATHS.CONTENT.FAQS, requireAuth, async (req, res) => {
  const parsed = CreateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const faq = await createFaq(parsed.data);
  res.status(201).json(faq);
});

// protected: update
router.patch(ROUTE_PATHS.CONTENT.FAQS_BY_ID, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateFaqBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const faq = await updateFaq(id, parsed.data);
  if (!faq) { res.status(404).json({ error: "Not found" }); return; }
  res.json(faq);
});

// protected: delete
router.delete(ROUTE_PATHS.CONTENT.FAQS_BY_ID, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteFaq(id);
  res.status(204).send();
});

export default router;
