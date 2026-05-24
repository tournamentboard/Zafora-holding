import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import { CreateTestimonialBody, UpdateTestimonialBody } from "./testimonials.validator.js";
import { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "./testimonials.service.js";

const router = Router();

// B4 — public: list
router.get(ROUTE_PATHS.TESTIMONIALS.LIST, async (_req, res) => {
  const testimonials = await listTestimonials();
  res.json({ testimonials });
});

// B5 — protected: admin CRUD
router.post(ROUTE_PATHS.TESTIMONIALS.LIST, requireAuth, async (req, res) => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const item = await createTestimonial(parsed.data);
  res.status(201).json(item);
});

router.patch(ROUTE_PATHS.TESTIMONIALS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const item = await updateTestimonial(id, parsed.data);
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(item);
});

router.delete(ROUTE_PATHS.TESTIMONIALS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteTestimonial(id);
  res.status(204).send();
});

export default router;
