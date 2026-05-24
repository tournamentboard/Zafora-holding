import { eq, asc } from "drizzle-orm";
import { db, contentStatsTable, methodologyStepsTable, siteSettingsTable } from "@/db/index.js";
import { logAction } from "@/modules/audit/index.js";
import type {
  CreateContentStatBodyType,
  UpdateContentStatBodyType,
  CreateMethodologyStepBodyType,
  UpdateMethodologyStepBodyType,
} from "./content.validator.js";

// ── Default seed data ─────────────────────────────────────────────

const DEFAULT_STATS = [
  { label: "Project Value Advised", value: "$2.4B", suffix: "+", description: "Total value of infrastructure projects advised", iconName: "DollarSign", displayOrder: 0, visible: true },
  { label: "African Countries Active", value: "12", suffix: "+", description: "Countries across the continent where Zafora operates", iconName: "Globe", displayOrder: 1, visible: true },
  { label: "Client Retention Rate", value: "95", suffix: "%", description: "Percentage of clients who continue working with us", iconName: "Award", displayOrder: 2, visible: true },
  { label: "Infrastructure Sectors", value: "6", suffix: "", description: "Specialized sectors we cover end-to-end", iconName: "Briefcase", displayOrder: 3, visible: true },
];

const DEFAULT_STEPS = [
  { stepNumber: 1, title: "Origination & Screening", description: "Identifying viable national projects and conducting preliminary technical and economic viability assessments.", iconName: "Target", displayOrder: 0, visible: true },
  { stepNumber: 2, title: "Feasibility & Structuring", description: "Developing bankable legal entities, ensuring ESG compliance, and establishing strong governance frameworks.", iconName: "ShieldCheck", displayOrder: 1, visible: true },
  { stepNumber: 3, title: "Capital Raising", description: "Connecting projects with our global network of DFIs, sovereign wealth funds, and private equity investors.", iconName: "DollarSign", displayOrder: 2, visible: true },
  { stepNumber: 4, title: "Procurement", description: "Transparent, competitive tendering to select world-class EPC contractors and technology partners.", iconName: "Handshake", displayOrder: 3, visible: true },
  { stepNumber: 5, title: "Execution Oversight", description: "Stringent project management, milestone tracking, and quality assurance during construction.", iconName: "TrendingUp", displayOrder: 4, visible: true },
  { stepNumber: 6, title: "Operations & Handover", description: "Ensuring smooth transition to operational phase with trained local personnel and O&M contracts.", iconName: "Award", displayOrder: 5, visible: true },
];

// ── Content Stats ─────────────────────────────────────────────────

export async function listContentStats() {
  let stats = await db.select().from(contentStatsTable).orderBy(asc(contentStatsTable.displayOrder));
  if (stats.length === 0) {
    await db.insert(contentStatsTable).values(DEFAULT_STATS);
    stats = await db.select().from(contentStatsTable).orderBy(asc(contentStatsTable.displayOrder));
  }
  return stats;
}

export async function createContentStat(data: CreateContentStatBodyType) {
  const [stat] = await db.insert(contentStatsTable).values({
    label: data.label,
    value: data.value,
    suffix: data.suffix ?? null,
    description: data.description ?? null,
    iconName: data.iconName ?? null,
    displayOrder: data.displayOrder,
    visible: data.visible,
  }).returning();

  logAction("create", "Content", `Stat created: "${data.label}"`, { statId: stat!.id }).catch(() => {});
  return stat!;
}

export async function updateContentStat(id: number, data: UpdateContentStatBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.label !== undefined) updates["label"] = data.label;
  if (data.value !== undefined) updates["value"] = data.value;
  if (data.suffix !== undefined) updates["suffix"] = data.suffix;
  if (data.description !== undefined) updates["description"] = data.description;
  if (data.iconName !== undefined) updates["iconName"] = data.iconName;
  if (data.displayOrder !== undefined) updates["displayOrder"] = data.displayOrder;
  if (data.visible !== undefined) updates["visible"] = data.visible;

  const [stat] = await db.update(contentStatsTable).set(updates).where(eq(contentStatsTable.id, id)).returning();
  if (!stat) return null;
  logAction("update", "Content", `Stat updated: "${stat.label}"`, { statId: id }).catch(() => {});
  return stat;
}

export async function deleteContentStat(id: number) {
  await db.delete(contentStatsTable).where(eq(contentStatsTable.id, id));
  logAction("delete", "Content", `Stat #${id} deleted`, { statId: id }).catch(() => {});
}

// ── Methodology Steps ─────────────────────────────────────────────

export async function listMethodologySteps() {
  let steps = await db.select().from(methodologyStepsTable).orderBy(asc(methodologyStepsTable.displayOrder));
  if (steps.length === 0) {
    await db.insert(methodologyStepsTable).values(DEFAULT_STEPS);
    steps = await db.select().from(methodologyStepsTable).orderBy(asc(methodologyStepsTable.displayOrder));
  }
  return steps;
}

export async function createMethodologyStep(data: CreateMethodologyStepBodyType) {
  const [step] = await db.insert(methodologyStepsTable).values({
    stepNumber: data.stepNumber,
    title: data.title,
    description: data.description,
    iconName: data.iconName ?? null,
    displayOrder: data.displayOrder,
    visible: data.visible,
  }).returning();

  logAction("create", "Content", `Methodology step created: "${data.title}"`, { stepId: step!.id }).catch(() => {});
  return step!;
}

export async function updateMethodologyStep(id: number, data: UpdateMethodologyStepBodyType) {
  const updates: Record<string, unknown> = {};
  if (data.stepNumber !== undefined) updates["stepNumber"] = data.stepNumber;
  if (data.title !== undefined) updates["title"] = data.title;
  if (data.description !== undefined) updates["description"] = data.description;
  if (data.iconName !== undefined) updates["iconName"] = data.iconName;
  if (data.displayOrder !== undefined) updates["displayOrder"] = data.displayOrder;
  if (data.visible !== undefined) updates["visible"] = data.visible;

  const [step] = await db.update(methodologyStepsTable).set(updates).where(eq(methodologyStepsTable.id, id)).returning();
  if (!step) return null;
  logAction("update", "Content", `Methodology step updated: "${step.title}"`, { stepId: id }).catch(() => {});
  return step;
}

export async function deleteMethodologyStep(id: number) {
  await db.delete(methodologyStepsTable).where(eq(methodologyStepsTable.id, id));
  logAction("delete", "Content", `Methodology step #${id} deleted`, { stepId: id }).catch(() => {});
}

// ── Site Settings ─────────────────────────────────────────────────

export async function getOrCreateSetting(key: string, defaultValue: object = {}) {
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(siteSettingsTable).values({ key, value: JSON.stringify(defaultValue) }).returning();
  return created!;
}

export async function upsertSetting(key: string, value: string) {
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (!existing) {
    const [created] = await db.insert(siteSettingsTable).values({ key, value }).returning();
    logAction("create", "Content", `Setting "${key}" created`).catch(() => {});
    return created!;
  }
  const [updated] = await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key)).returning();
  logAction("update", "Content", `Setting "${key}" updated`).catch(() => {});
  return updated!;
}
