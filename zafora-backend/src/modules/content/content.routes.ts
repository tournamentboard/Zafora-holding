import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import {
  CreateContentStatBody,
  UpdateContentStatBody,
  CreateMethodologyStepBody,
  UpdateMethodologyStepBody,
  UpsertSettingBody,
} from "./content.validator.js";
import {
  listContentStats,
  createContentStat,
  updateContentStat,
  deleteContentStat,
  listMethodologySteps,
  createMethodologyStep,
  updateMethodologyStep,
  deleteMethodologyStep,
  getOrCreateSetting,
  upsertSetting,
} from "./content.service.js";

const router = Router();

// ── Content Stats ─────────────────────────────────────────────────

// B4 — public
router.get(ROUTE_PATHS.CONTENT.STATS, async (_req, res) => {
  const stats = await listContentStats();
  res.json({ stats });
});

// B5 — protected
router.post(ROUTE_PATHS.CONTENT.STATS, requireAuth, async (req, res) => {
  const parsed = CreateContentStatBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const stat = await createContentStat(parsed.data);
  res.status(201).json(stat);
});

router.patch(`${ROUTE_PATHS.CONTENT.STATS}/:id`, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateContentStatBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const stat = await updateContentStat(id, parsed.data);
  if (!stat) { res.status(404).json({ error: "Not found" }); return; }
  res.json(stat);
});

router.delete(`${ROUTE_PATHS.CONTENT.STATS}/:id`, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteContentStat(id);
  res.status(204).send();
});

// ── Methodology Steps ─────────────────────────────────────────────

// B4 — public
router.get(ROUTE_PATHS.CONTENT.METHODOLOGY, async (_req, res) => {
  const steps = await listMethodologySteps();
  res.json({ steps });
});

// B5 — protected
router.post(ROUTE_PATHS.CONTENT.METHODOLOGY, requireAuth, async (req, res) => {
  const parsed = CreateMethodologyStepBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const step = await createMethodologyStep(parsed.data);
  res.status(201).json(step);
});

router.patch(`${ROUTE_PATHS.CONTENT.METHODOLOGY}/:id`, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateMethodologyStepBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const step = await updateMethodologyStep(id, parsed.data);
  if (!step) { res.status(404).json({ error: "Not found" }); return; }
  res.json(step);
});

router.delete(`${ROUTE_PATHS.CONTENT.METHODOLOGY}/:id`, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteMethodologyStep(id);
  res.status(204).send();
});

// ── Site Settings ─────────────────────────────────────────────────

// B4 — public read
router.get(ROUTE_PATHS.CONTENT.SETTINGS, async (req, res) => {
  const key = String(req.params["key"]);
  const setting = await getOrCreateSetting(key);
  res.json(setting);
});

// B5 — protected write
router.patch(ROUTE_PATHS.CONTENT.SETTINGS, requireAuth, async (req, res) => {
  const key = String(req.params["key"]);
  const parsed = UpsertSettingBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const setting = await upsertSetting(key, parsed.data.value);
  res.json(setting);
});

export default router;
