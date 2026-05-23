import { Router } from "express";

import { eq, desc, count, and, gte } from "drizzle-orm";


import { db, leadsTable } from "@/workplace/db/src/index.js";
import { logAction } from "./audit.js";
import { CreateLeadBody, ListLeadsQueryParams, UpdateLeadBody } from "@/workplace/api-zod/src/index.js";
import { sendInquiryNotification } from "@/email.js";

const router = Router();

router.get("/leads", async (req, res) => {
  const parsed = ListLeadsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { status, requestType, page, limit } = parsed.data;
  let conditions: ReturnType<typeof eq>[] = [];
  if (status) conditions.push(eq(leadsTable.status, status));
  if (requestType) conditions.push(eq(leadsTable.requestType, requestType));

  const offset = (page - 1) * limit;
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [leads, totalResult] = await Promise.all([
    db.select().from(leadsTable).where(where).orderBy(desc(leadsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(leadsTable).where(where),
  ]);

  res.json({ leads, total: totalResult[0]?.count ?? 0 });
});

router.post("/leads", async (req, res) => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }
  const data = parsed.data;
  const [lead] = await db.insert(leadsTable).values({
    fullName: data.fullName,
    organization: data.organization,
    email: data.email,
    phone: data.phone ?? null,
    country: data.country,
    requestType: data.requestType,
    projectSector: data.projectSector ?? null,
    message: data.message,
    budgetFundingNeed: data.budgetFundingNeed ?? null,
    projectTimeline: data.projectTimeline ?? null,
    roleType: data.roleType ?? null,
    status: "new",
  }).returning();
  res.status(201).json(lead);
  sendInquiryNotification(lead).catch(() => {});
  logAction("create", "CRM", `New inquiry from ${data.fullName} (${data.organization})`, { leadId: lead.id, email: data.email }).catch(() => {});
});

router.get("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(lead);
});

router.patch("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;
  if (parsed.data.followUpDate !== undefined) updates.followUpDate = parsed.data.followUpDate;

  const [lead] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
  if (!lead) { res.status(404).json({ error: "Not found" }); return; }
  res.json(lead);
  if (parsed.data.status) {
    logAction("update", "CRM", `Inquiry #${id} status changed to "${parsed.data.status}"`, { leadId: id, status: parsed.data.status }).catch(() => {});
  }
});

export default router;
