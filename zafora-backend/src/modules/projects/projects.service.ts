import { eq, desc, count, and, ilike, sql } from "drizzle-orm";
import { db, projectsTable, projectInterestsTable } from "@/db/index.js";
import { sendInterestNotification } from "@/shared/lib/email.js";
import { logAction } from "@/modules/audit/index.js";
import type {
  CreateProjectBodyType,
  UpdateProjectBodyType,
  ListProjectsQueryType,
  ExpressInterestBodyType,
} from "./projects.validator.js";

export async function listProjects(query: ListProjectsQueryType) {
  const { sector, status, country, search, page, limit } = query;
  const conditions = [];
  if (sector) conditions.push(eq(projectsTable.sector, sector));
  if (status) conditions.push(eq(projectsTable.fundingStatus, status));
  if (country) conditions.push(eq(projectsTable.country, country));
  if (search) conditions.push(ilike(projectsTable.name, `%${search}%`));

  const offset = (page - 1) * limit;
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [projects, totalResult] = await Promise.all([
    db.select().from(projectsTable).where(where).orderBy(desc(projectsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(projectsTable).where(where),
  ]);

  return { projects, total: totalResult[0]?.count ?? 0 };
}

export async function getProjectById(id: number) {
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1);
  return project ?? null;
}

export async function createProject(data: CreateProjectBodyType) {
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

  logAction("create", "Pipeline", `Project created: "${data.name}" (${data.country})`, {
    projectId: project!.id,
  }).catch(() => {});

  return project!;
}

export async function updateProject(id: number, data: UpdateProjectBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates["name"] = data.name;
  if (data.sector !== undefined) updates["sector"] = data.sector;
  if (data.country !== undefined) updates["country"] = data.country;
  if (data.region !== undefined) updates["region"] = data.region;
  if (data.fundingStatus !== undefined) updates["fundingStatus"] = data.fundingStatus;
  if (data.estimatedValue !== undefined) updates["estimatedValue"] = data.estimatedValue;
  if (data.zaforaRole !== undefined) updates["zaforaRole"] = data.zaforaRole;
  if (data.partnerNeed !== undefined) updates["partnerNeed"] = data.partnerNeed;
  if (data.description !== undefined) updates["description"] = data.description;
  if (data.imageUrl !== undefined) updates["imageUrl"] = data.imageUrl;

  const [project] = await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id)).returning();
  if (!project) return null;

  logAction("update", "Pipeline", `Project updated: "${project.name}"`, { projectId: id }).catch(() => {});
  return project;
}

export async function deleteProject(id: number) {
  const [project] = await db.select({ name: projectsTable.name }).from(projectsTable).where(eq(projectsTable.id, id));
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  logAction("delete", "Pipeline", `Project deleted: "${project?.name ?? `#${id}`}"`, { projectId: id }).catch(() => {});
}

export async function listProjectInterests(projectId: number) {
  const [interests, totalResult] = await Promise.all([
    db.select().from(projectInterestsTable).where(eq(projectInterestsTable.projectId, projectId)).orderBy(desc(projectInterestsTable.createdAt)),
    db.select({ count: count() }).from(projectInterestsTable).where(eq(projectInterestsTable.projectId, projectId)),
  ]);
  return { interests, total: totalResult[0]?.count ?? 0 };
}

export async function createProjectInterest(projectId: number, data: ExpressInterestBodyType) {
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

  const [project] = await db.select({ name: projectsTable.name }).from(projectsTable).where(eq(projectsTable.id, projectId));
  sendInterestNotification(interest!, project?.name ?? `Project #${projectId}`).catch(() => {});
  logAction("create", "CRM", `Interest expressed by ${data.fullName} in "${project?.name ?? `Project #${projectId}`}"`, {
    projectId,
    organization: data.organization,
  }).catch(() => {});

  return interest!;
}
