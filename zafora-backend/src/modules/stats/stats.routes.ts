import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { getDashboardStats, getProjectStats } from "./stats.service.js";

const router = Router();

// B5 — protected: admin stats
router.get(ROUTE_PATHS.STATS.OVERVIEW, requireAuth, async (_req, res) => {
  const stats = await getDashboardStats();
  res.json(stats);
});

router.get(`${ROUTE_PATHS.STATS.OVERVIEW}/projects`, requireAuth, async (_req, res) => {
  const stats = await getProjectStats();
  res.json(stats);
});

export default router;
