import { Router } from "express";

import { eq, desc, count, and, ilike, sql } from "drizzle-orm";

import {
  CreateProjectBody,
  ListProjectsQueryParams,
  UpdateProjectBody,
  UpdateProjectParams,
  ExpressInterestBody,
} from "@/workplace/api-zod/src/index.js";
import { db, projectInterestsTable, projectsTable } from "@/workplace/db/src/index.js";
import { logAction } from "./audit.js";
import { ListProjectInterestsParams } from "@/workplace/api-zod/src/index.js";
import { sendInterestNotification } from "@/shared/lib/email.js";

const router = Router();

router.get("/projects", async (req, res) => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { sector, status, country, search } = parsed.data;
  let conditions: ReturnType<typeof eq>[] = [];
  if (sector) conditions.push(eq(projectsTable.sector, sector));
  if (status) conditions.push(eq(projectsTable.fundingStatus, status));
  if (country) conditions.push(eq(projectsTable.country, country));
  if (search) conditions.push(ilike(projectsTable.name, `%${search}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [projects, totalResult] = await Promise.all([
    db.select().from(projectsTable).where(where).orderBy(desc(projectsTable.createdAt)),
    db.select({ count: count() }).from(projectsTable).where(where),
  ]);

  res.json({ projects, total: totalResult[0]?.count ?? 0 });
});

router.post("/projects", async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }
  const data = parsed.data;
  const [project] = await db.insert(projectsTable).values({
    name: data.name,
    sector: data.sector,
    country: data.country,
    region: data.region ?? null,
    fundingStatus: data.fundingStatus,
    estimatedValue: data.estimatedValue,
    zaforaRole: data.zaforaRole,
    partnerNeed: data.partnerNeed ?? null,
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
    interestCount: 0,
  }).returning();
  res.status(201).json(project);
  logAction("create", "Pipeline", `Project created: "${data.name}" (${data.country})`, { projectId: project.id }).catch(() => {});
});

router.get("/projects/:id", async (req, res) => {
  const parsed = UpdateProjectParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, parsed.data.id));
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
});

router.patch("/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updates: Record<string, unknown> = {};
  const data = parsed.data;
  if (data.name !== undefined) updates.name = data.name;
  if (data.sector !== undefined) updates.sector = data.sector;
  if (data.country !== undefined) updates.country = data.country;
  if (data.region !== undefined) updates.region = data.region;
  if (data.fundingStatus !== undefined) updates.fundingStatus = data.fundingStatus;
  if (data.estimatedValue !== undefined) updates.estimatedValue = data.estimatedValue;
  if (data.zaforaRole !== undefined) updates.zaforaRole = data.zaforaRole;
  if (data.partnerNeed !== undefined) updates.partnerNeed = data.partnerNeed;
  if (data.description !== undefined) updates.description = data.description;
  if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl;

  const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id)).returning();
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json(project);
  logAction("update", "Pipeline", `Project updated: "${project.name}"`, { projectId: id }).catch(() => {});
});

router.delete("/projects/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [project] = await db.select({ name: projectsTable.name }).from(projectsTable).where(eq(projectsTable.id, id));
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).send();
  logAction("delete", "Pipeline", `Project deleted: "${project?.name ?? `#${id}`}"`, { projectId: id }).catch(() => {});
});

router.get("/projects/:id/interests", async (req, res) => {
  const parsed = ListProjectInterestsParams.safeParse({ id: parseInt(req.params.id) });
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [interests, totalResult] = await Promise.all([
    db.select().from(projectInterestsTable).where(eq(projectInterestsTable.projectId, parsed.data.id)).orderBy(desc(projectInterestsTable.createdAt)),
    db.select({ count: count() }).from(projectInterestsTable).where(eq(projectInterestsTable.projectId, parsed.data.id)),
  ]);
  res.json({ interests, total: totalResult[0]?.count ?? 0 });
});

router.post("/projects/:id/interests", async (req, res) => {
  const projectId = parseInt(req.params.id);
  if (isNaN(projectId)) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = ExpressInterestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error });
    return;
  }
  const data = parsed.data;
  const [interest] = await db.insert(projectInterestsTable).values({
    projectId,
    fullName: data.fullName,
    organization: data.organization,
    email: data.email,
    phone: data.phone ?? null,
    roleType: data.roleType,
    message: data.message ?? null,
  }).returning();

  await db.update(projectsTable)
    .set({ interestCount: sql`${projectsTable.interestCount} + 1` })
    .where(eq(projectsTable.id, projectId));

  res.status(201).json(interest);

  const [project] = await db.select({ name: projectsTable.name }).from(projectsTable).where(eq(projectsTable.id, projectId));
  sendInterestNotification(interest, project?.name ?? `Project #${projectId}`).catch(() => {});
  logAction("create", "CRM", `Interest expressed by ${data.fullName} in "${project?.name ?? `Project #${projectId}`}"`, { projectId, organizaton: data.organization }).catch(() => {});
});

export default router;
