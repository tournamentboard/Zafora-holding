import { Router } from "express";
import { db, servicesTable } from "@workspace/db";

const router = Router();

router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable);
  res.json({ services });
});

export default router;
