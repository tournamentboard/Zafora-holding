import { Router } from "express";
import { db, contentStatsTable, methodologyStepsTable, siteSettingsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

// ── Default seed data ──────────────────────────────────────────────

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

const SETTING_DEFAULTS: Record<string, object> = {
  notifications: {
    adminEmail: "Office@zaforaholding.com",
    notifyOnInquiry: true,
    notifyOnInterest: true,
  },
  hero: {
    headline: "Structuring, funding, and delivering high-impact projects.",
    subheadline: "Zafora Holding connects governments, investors, and contractors to develop and deliver critical infrastructure across Africa.",
    badge: "Strategic Infrastructure & Consulting · Est. 2025",
    primaryBtnText: "Partner With Us",
    primaryBtnLink: "/submit",
    secondaryBtnText: "View Pipeline",
    secondaryBtnLink: "/projects",
    thirdBtnText: "Our Services",
    thirdBtnLink: "/services",
  },
  footer: {
    description: "Zafora Holding is a U.S.-based strategic infrastructure advisory and development firm connecting governments, investors, and contractors with large-scale infrastructure projects.",
    email: "Office@zaforaholding.com",
    address: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607, USA",
    phone: "",
    copyright: "2025",
  },
  seo_home: {
    title: "Zafora Holding — Infrastructure Advisory & Project Development",
    description: "Zafora Holding connects governments, investors, and contractors with large-scale infrastructure projects across Africa.",
    keywords: "infrastructure advisory, project finance, PPP, Africa infrastructure, DFI funding",
    ogTitle: "Zafora Holding",
    ogDescription: "Strategic infrastructure advisory and development firm.",
  },
  seo_about: {
    title: "About Us — Zafora Holding",
    description: "Learn about Zafora Holding, founded in January 2025 in Tampa, Florida, and our mission to bridge the infrastructure gap across Africa.",
    keywords: "Zafora Holding, about, infrastructure firm, Tampa Florida",
    ogTitle: "About Zafora Holding",
    ogDescription: "Founded 2025, Tampa FL — bridging the infrastructure gap.",
  },
  seo_services: {
    title: "Services — Zafora Holding",
    description: "End-to-end infrastructure advisory services: Government Advisory, Project Finance, PPP Structuring, Capital Raising, ESG Compliance, and more.",
    keywords: "infrastructure services, government advisory, project finance, PPP, ESG compliance",
    ogTitle: "Zafora Holding Services",
    ogDescription: "Six specialized infrastructure advisory practices.",
  },
  seo_projects: {
    title: "Project Pipeline — Zafora Holding",
    description: "Explore Zafora Holding's curated portfolio of high-impact infrastructure projects across Africa seeking funding and partners.",
    keywords: "infrastructure projects, Africa pipeline, investment opportunities, project finance",
    ogTitle: "Zafora Holding Project Pipeline",
    ogDescription: "Curated infrastructure projects across Africa.",
  },
  about: {
    storyHeadline: "Built to bridge the infrastructure gap.",
    story: "Zafora Holding was founded in January 2025 in Tampa, Florida, with a clear mandate: to bridge the critical gap between ambitious infrastructure visions and real-world project execution across Africa.",
    mission: "To be the leading strategic bridge between infrastructure ambition and execution — connecting governments, investors, and contractors to deliver high-impact projects that transform lives and economies.",
    vision: "A world where every African nation has access to reliable, world-class infrastructure that drives economic growth and improves quality of life.",
    companyName: "Zafora Holding",
    founded: "January 2025",
    headquarters: "Tampa, FL, USA",
    email: "Office@zaforaholding.com",
    address: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607, USA",
  },
};

async function getOrCreateSetting(key: string) {
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (existing.length > 0) return existing[0];
  const defaultVal = SETTING_DEFAULTS[key] ?? {};
  const [created] = await db.insert(siteSettingsTable).values({ key, value: JSON.stringify(defaultVal) }).returning();
  return created;
}

// ── Content Stats ──────────────────────────────────────────────────

router.get("/content/stats", async (_req, res) => {
  let stats = await db.select().from(contentStatsTable).orderBy(asc(contentStatsTable.displayOrder));
  if (stats.length === 0) {
    await db.insert(contentStatsTable).values(DEFAULT_STATS);
    stats = await db.select().from(contentStatsTable).orderBy(asc(contentStatsTable.displayOrder));
  }
  res.json({ stats });
});

router.post("/content/stats", async (req, res) => {
  const body = req.body as any;
  const [stat] = await db.insert(contentStatsTable).values({
    label: body.label,
    value: body.value,
    suffix: body.suffix ?? null,
    description: body.description ?? null,
    iconName: body.iconName ?? null,
    displayOrder: body.displayOrder ?? 0,
    visible: body.visible ?? true,
  }).returning();
  res.status(201).json(stat);
});

router.patch("/content/stats/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [stat] = await db.update(contentStatsTable).set({
    ...(body.label !== undefined && { label: body.label }),
    ...(body.value !== undefined && { value: body.value }),
    ...(body.suffix !== undefined && { suffix: body.suffix }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.iconName !== undefined && { iconName: body.iconName }),
    ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    ...(body.visible !== undefined && { visible: body.visible }),
  }).where(eq(contentStatsTable.id, id)).returning();
  if (!stat) { res.status(404).json({ error: "Not found" }); return; }
  res.json(stat);
});

router.delete("/content/stats/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(contentStatsTable).where(eq(contentStatsTable.id, id));
  res.status(204).send();
});

// ── Methodology Steps ──────────────────────────────────────────────

router.get("/content/methodology", async (_req, res) => {
  let steps = await db.select().from(methodologyStepsTable).orderBy(asc(methodologyStepsTable.displayOrder));
  if (steps.length === 0) {
    await db.insert(methodologyStepsTable).values(DEFAULT_STEPS);
    steps = await db.select().from(methodologyStepsTable).orderBy(asc(methodologyStepsTable.displayOrder));
  }
  res.json({ steps });
});

router.post("/content/methodology", async (req, res) => {
  const body = req.body as any;
  const [step] = await db.insert(methodologyStepsTable).values({
    stepNumber: body.stepNumber,
    title: body.title,
    description: body.description,
    iconName: body.iconName ?? null,
    displayOrder: body.displayOrder ?? 0,
    visible: body.visible ?? true,
  }).returning();
  res.status(201).json(step);
});

router.patch("/content/methodology/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [step] = await db.update(methodologyStepsTable).set({
    ...(body.stepNumber !== undefined && { stepNumber: body.stepNumber }),
    ...(body.title !== undefined && { title: body.title }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.iconName !== undefined && { iconName: body.iconName }),
    ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    ...(body.visible !== undefined && { visible: body.visible }),
  }).where(eq(methodologyStepsTable.id, id)).returning();
  if (!step) { res.status(404).json({ error: "Not found" }); return; }
  res.json(step);
});

router.delete("/content/methodology/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(methodologyStepsTable).where(eq(methodologyStepsTable.id, id));
  res.status(204).send();
});

// ── Site Settings ──────────────────────────────────────────────────

router.get("/content/settings/:key", async (req, res) => {
  const { key } = req.params;
  const setting = await getOrCreateSetting(key);
  res.json(setting);
});

router.patch("/content/settings/:key", async (req, res) => {
  const { key } = req.params;
  const { value } = req.body as { value: string };
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (existing.length === 0) {
    const [created] = await db.insert(siteSettingsTable).values({ key, value }).returning();
    res.json(created);
  } else {
    const [updated] = await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key)).returning();
    res.json(updated);
  }
});

export default router;
