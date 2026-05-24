import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import { CreateLeadBody, UpdateLeadBody, ListLeadsQuery } from "./leads.validator.js";
import { listLeads, getLeadById, createLead, updateLead } from "./leads.service.js";

const router = Router();

// B5 — protected: admin list + detail + update
router.get(ROUTE_PATHS.LEADS.LIST, requireAuth, async (req, res) => {
  const parsed = ListLeadsQuery.safeParse(req.query);
  if (!parsed.success) { res.status(400).json({ error: "Invalid query params" }); return; }
  const result = await listLeads(parsed.data);
  res.json(result);
});

// B4 — public: submit inquiry
router.post(ROUTE_PATHS.LEADS.LIST, async (req, res) => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const lead = await createLead(parsed.data);
  res.status(201).json(lead);
});

router.get(ROUTE_PATHS.LEADS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const lead = await getLeadById(id);
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(lead);
});

router.patch(ROUTE_PATHS.LEADS.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateLeadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const lead = await updateLead(id, parsed.data);
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(lead);
});

export default router;
