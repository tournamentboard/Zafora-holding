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

const SETTING_DEFAULTS: Record<string, object> = {
  notifications: {
    adminEmail: "Office@zaforaholding.com",
    notifyOnInquiry: true,
    notifyOnInterest: true,
  },
  navigation: [
    { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
    { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
    { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
    { id: "gov", label: "Government Review", href: "/government-review", visible: true, openNewTab: false, order: 3 },
  ],
  branding: {
    siteName: "Zafora Holding",
    tagline: "Infrastructure. Capital. Delivery.",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#173f35",
    accentColor: "#c59b4a",
    bgColor: "#f7f4ef",
    footerColor: "#10231f",
    bodyFont: "Inter",
    headingFont: "Inter",
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
    featureBadge1: "Government-ready documentation",
    featureBadge2: "PPP & funding advisory",
    featureBadge3: "Project lifecycle governance",
    panelCaption: "For governments, funders, and delivery partners.",
    panelStat: "Open",
    panelStatLabel: "Accepting Mandates",
  },
  footer: {
    description: "Zafora Holding is a U.S.-based strategic infrastructure advisory and development firm connecting governments, investors, and contractors with large-scale infrastructure projects.",
    email: "Office@zaforaholding.com",
    address: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607, USA",
    phone: "",
    copyright: "2025",
  },
  announcement_bar: {
    enabled: false,
    message: "Welcome to Zafora Holding",
    link: "",
    linkText: "Learn more",
    dismissible: true,
    bgColor: "#173f35",
    textColor: "#ffffff",
  },
  maintenance_mode: {
    enabled: false,
    headline: "We'll be back soon.",
    message: "We're performing scheduled maintenance. Please check back shortly.",
    showContactEmail: true,
    estimatedTime: "",
  },
  legal_privacy: {
    title: "Privacy Policy",
    lastUpdated: "January 2025",
    content: "Zafora Holding is committed to protecting your privacy. This policy explains how we collect and use your information when you visit our website.\n\nWe collect information you voluntarily provide (name, email, company) and usage data. We use it to respond to inquiries and improve our services. We do not sell your personal data.\n\nContact us at Office@zaforaholding.com with any questions.",
  },
  legal_terms: {
    title: "Terms of Service",
    lastUpdated: "January 2025",
    content: "By accessing this website you agree to these Terms of Service.\n\nAll content on this site is the property of Zafora Holding and protected by applicable laws. You may use this site for lawful purposes only.\n\nZafora Holding shall not be liable for any indirect or consequential damages arising from use of this site.\n\nContact us at Office@zaforaholding.com with any questions.",
  },
  section_visibility: {
    home: { hero: true, ticker: true, stats: true, services: true, methodology: true, testimonial: true, projects: true, sectors: true, cta: true },
    about: { hero: true, stats: true, story: true, mvp: true, values: true, team: true, timeline: true, cta: true },
    services: { hero: true, stats: true, cards: true, cta: true },
    projects: { hero: true, filter: true, grid: true },
    government: { hero: true, stats: true, capability: true, framework: true, cta: true },
    submit: { hero: true, form: true, sidebar: true },
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
  },
  seo_services: {
    title: "Services — Zafora Holding",
    description: "End-to-end infrastructure advisory services: Government Advisory, Project Finance, PPP Structuring, Capital Raising, ESG Compliance, and more.",
    keywords: "infrastructure services, government advisory, project finance, PPP, ESG compliance",
  },
  seo_projects: {
    title: "Project Pipeline — Zafora Holding",
    description: "Explore Zafora Holding's curated portfolio of high-impact infrastructure projects across Africa seeking funding and partners.",
    keywords: "infrastructure projects, Africa pipeline, investment opportunities, project finance",
  },
  about: {
    hero: {
      headline: "Bridging global opportunities through infrastructure intelligence.",
      subheadline: "Zafora Holding is a U.S.-based strategic infrastructure, investment, and consulting company connecting governments, enterprises, investors, and contractors to scalable opportunities across global markets.",
      badge: "About Zafora Holding",
      btn1Text: "Work With Us",
      btn1Link: "/submit",
      btn2Text: "View Our Pipeline",
      btn2Link: "/projects",
    },
    stats: [
      { value: "2025", label: "Founded — Tampa, FL, USA" },
      { value: "Africa · Americas", label: "Primary Markets" },
      { value: "6", label: "Core Practice Areas" },
      { value: "Global", label: "Strategic Partnerships" },
    ],
    identity: {
      quote: "Infrastructure development across Africa requires more than advisory. It requires a partner who structures projects that capital trusts, governments can deliver, and communities benefit from.",
      quoteAttribution: "— Zafora Holding",
      founded: "January 2025",
      headquarters: "Tampa, FL, USA",
      contact: "Office@zaforaholding.com",
      markets: "Africa · Americas · Caribbean",
    },
    mvp: {
      sectionHeadline: "Mission, Vision & Purpose",
      sectionSubheadline: "Three commitments that define how we work — and why Zafora was built.",
      mission: "To structure bankable, deliverable infrastructure across Africa and emerging markets — connecting sovereign governments, development finance institutions, and private capital through trusted, execution-focused advisory.",
      vision: "To be recognized as the most trusted infrastructure advisory and development partner for African governments and global investors.",
      purpose: "To prove that infrastructure development in Africa can be transparent, scalable, and community-positive.",
    },
  },
};

export async function getOrCreateSetting(key: string, defaultValue?: object) {
  const [existing] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key)).limit(1);
  if (existing) return existing;
  const fallback = defaultValue ?? SETTING_DEFAULTS[key] ?? {};
  const [created] = await db.insert(siteSettingsTable).values({ key, value: JSON.stringify(fallback) }).returning();
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
