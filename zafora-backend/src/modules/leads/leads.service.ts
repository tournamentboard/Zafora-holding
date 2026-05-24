import { eq, desc, count, and } from "drizzle-orm";
import { db, leadsTable } from "@/db/index.js";
import { sendInquiryNotification } from "@/shared/lib/email.js";
import { logAction } from "@/modules/audit/index.js";
import type { CreateLeadBodyType, UpdateLeadBodyType, ListLeadsQueryType } from "./leads.validator.js";

export async function listLeads(query: ListLeadsQueryType) {
  const { status, requestType, page, limit } = query;
  const conditions = [];
  if (status) conditions.push(eq(leadsTable.status, status));
  if (requestType) conditions.push(eq(leadsTable.requestType, requestType));

  const offset = (page - 1) * limit;
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [leads, totalResult] = await Promise.all([
    db.select().from(leadsTable).where(where).orderBy(desc(leadsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(leadsTable).where(where),
  ]);

  return { leads, total: totalResult[0]?.count ?? 0 };
}

export async function getLeadById(id: number) {
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);
  return lead ?? null;
}

export async function createLead(data: CreateLeadBodyType) {
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

  sendInquiryNotification(lead!).catch(() => {});
  logAction("create", "CRM", `New inquiry from ${data.fullName} (${data.organization})`, {
    leadId: lead!.id,
    email: data.email,
  }).catch(() => {});

  return lead!;
}

export async function updateLead(id: number, data: UpdateLeadBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.status !== undefined) updates["status"] = data.status;
  if (data.notes !== undefined) updates["notes"] = data.notes;
  if (data.followUpDate !== undefined) updates["followUpDate"] = data.followUpDate;

  const [lead] = await db.update(leadsTable).set(updates).where(eq(leadsTable.id, id)).returning();
  if (!lead) return null;

  if (data.status) {
    logAction("update", "CRM", `Inquiry #${id} status changed to "${data.status}"`, {
      leadId: id,
      status: data.status,
    }).catch(() => {});
  }

  return lead;
}
