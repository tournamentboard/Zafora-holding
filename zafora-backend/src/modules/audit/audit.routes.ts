import { Router } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";
import { listAuditLogs, clearAuditLogs } from "./audit.service.js";

const router = Router();

router.get(ROUTE_PATHS.AUDIT.LIST, requireAuth, async (req, res) => {
  const limit = Math.min(parseInt((req.query["limit"] as string) ?? "50"), 200);
  const logs = await listAuditLogs(limit);
  res.json({ logs });
});

router.delete(ROUTE_PATHS.AUDIT.LIST, requireAuth, async (_req, res) => {
  await clearAuditLogs();
  res.status(204).send();
});

export default router;
