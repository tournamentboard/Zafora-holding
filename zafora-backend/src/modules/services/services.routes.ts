import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { parseIdParam } from "@/shared/api-helpers/index.js";
import { CreateServiceBody, UpdateServiceBody } from "./services.validator.js";
import { listServices, createService, updateService, deleteService } from "./services.service.js";

const router = Router();

// B4 — public: list services
router.get(ROUTE_PATHS.SERVICES.LIST, async (_req, res) => {
  const services = await listServices();
  res.json({ services });
});

// B5 — protected: admin CRUD
router.post(ROUTE_PATHS.SERVICES.LIST, requireAuth, async (req, res) => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body", details: parsed.error }); return; }
  const service = await createService(parsed.data);
  res.status(201).json(service);
});

router.patch(ROUTE_PATHS.SERVICES.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const service = await updateService(id, parsed.data);
  if (!service) { res.status(404).json({ error: "Not found" }); return; }
  res.json(service);
});

router.delete(ROUTE_PATHS.SERVICES.DETAIL, requireAuth, async (req, res) => {
  const id = parseIdParam(req, res);
  if (id === null) return;
  await deleteService(id);
  res.status(204).send();
});

export default router;
