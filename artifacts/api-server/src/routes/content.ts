import { Router } from "express";
import { db, contentStatsTable, methodologyStepsTable, siteSettingsTable, faqsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

// ── Default seed data ──────────────────────────────────────────────

const DEFAULT_STATS = [
  { label: "Regional Coverage", value: "Pan-African", suffix: "", description: "Infrastructure advisory spanning multiple African markets", iconName: "Globe", displayOrder: 0, visible: true },
  { label: "Project Lifecycle", value: "End-to-End", suffix: "", description: "From concept and structuring through to delivery and operations", iconName: "TrendingUp", displayOrder: 1, visible: true },
  { label: "Infrastructure Sectors", value: "6", suffix: "", description: "Specialized sectors we cover end-to-end", iconName: "Briefcase", displayOrder: 2, visible: true },
  { label: "Core Service Pillars", value: "3", suffix: "", description: "Advisory · Capital · Delivery", iconName: "Award", displayOrder: 3, visible: true },
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
  navigation: [
    { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
    { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
    { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
    { id: "gov", label: "Government Review", href: "/government", visible: true, openNewTab: false, order: 3 },
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
  services_page: {
    hero: {
      headline: "Advisory built for Africa's complexity.",
      subheadline: "Comprehensive structuring, funding, and delivery solutions — tailored to the political, economic, and regulatory realities of African infrastructure.",
      badge: "Six Specialized Practices",
    },
    stats: [
      { value: "6", label: "Infrastructure Sectors" },
      { value: "Pan-African", label: "Regional Reach" },
      { value: "End-to-End", label: "Project Lifecycle" },
      { value: "100%", label: "Confidential" },
    ],
    cta: {
      headline: "Start with a confidential consultation.",
      subheadline: "Our advisors will assess your project and propose the most effective pathway forward.",
      btnText: "Start Conversation",
      btnLink: "/submit",
    },
  },
  government_page: {
    hero: {
      headline: "Government Review Center",
      subheadline: "Zafora partners with sovereign governments to structure, derisk, and deliver national infrastructure agendas. We translate political vision into bankable, executable projects.",
      badge: "Government Portal",
      btn1Text: "Request Capability Pack",
      btn1Link: "/submit?type=government",
      btn2Text: "Start a Project",
      btn2Link: "/submit",
    },
    stats: [
      { value: "Pan-African", label: "Regional Coverage" },
      { value: "End-to-End", label: "Project Delivery" },
      { value: "100%", label: "DFI-Compatible" },
      { value: "6", label: "Infrastructure Sectors" },
    ],
    capability: {
      headline: "The critical bridge between state ambition and global capital.",
      paragraph1: "As a premier African infrastructure advisory, Zafora Holding acts as the critical bridge between state requirements and global capital markets. We understand that government projects must balance rapid delivery with long-term fiscal prudence.",
      paragraph2: "Our approach ensures that projects are structured as independent, commercially viable entities capable of attracting DFI funding and private capital, without overburdening sovereign balance sheets.",
    },
    cta: {
      headline: "Ready to advance your national agenda?",
      subheadline: "Begin with a confidential briefing. Our senior advisors will assess your project and propose the most bankable structure.",
      btn1Text: "Start a Confidential Briefing",
      btn1Link: "/submit?type=government",
      btn2Text: "View Pipeline",
      btn2Link: "/projects",
    },
    sidebar: {
      ctaTitle: "Request Capability Pack",
      ctaDesc: "Government ministries and sovereign wealth funds can request our full credentials, track record, and compliance documentation.",
      ctaBtnText: "Secure Access Request",
      ctaBtnLink: "/submit?type=government",
      commitments: [
        "Full confidentiality on all submitted materials",
        "Response within 48 business hours",
        "No obligation preliminary assessment",
        "Senior advisor assignment from day one",
        "Alignment with African Union frameworks",
      ],
    },
  },
  submit_page: {
    hero: {
      headline: "Submit Your Request",
      subheadline: "Initiate a dialogue with Zafora Holding. Whether you are a government entity, investor, or project developer, share your details below.",
      badge: "Start a Conversation",
    },
    sidebar: {
      whyTitle: "Why submit to Zafora?",
      whyBullets: [
        "Senior advisor review within 48 hours",
        "No-obligation preliminary assessment",
        "Direct DFI and investor connections",
        "Full confidentiality guaranteed",
        "Pan-African infrastructure focus",
      ],
      responseTime: "48-hour response",
      responseDesc: "A senior advisor will review your submission and respond within two business days.",
    },
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
  about: {
    hero: {
      headline: "Bridging global opportunities through infrastructure intelligence.",
      subheadline: "Zafora Holding is a U.S.-based strategic infrastructure, investment, and consulting company connecting governments, enterprises, investors, and contractors to scalable opportunities across global markets.",
      badge: "About Zafora Holding",
      btn1Text: "Work With Us", btn1Link: "/submit",
      btn2Text: "View Our Pipeline", btn2Link: "/projects",
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
    whoWeAre: {
      headline: "Built to close the gap between political ambition and investable infrastructure.",
      paragraph1: "Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holding is a U.S.-based strategic infrastructure advisory and development firm. We were established to address a persistent gap in African infrastructure: the disconnect between government intent, investor appetite, and execution capability.",
      paragraph2: "We operate at the intersection of public ambition and private capital — structuring projects that meet international finance standards, attract DFI and institutional funding, and deliver measurable, lasting impact on the ground.",
      paragraph3: "Our organization brings together expertise in sovereign advisory, project finance structuring, PPP frameworks, ESG compliance, and end-to-end project delivery — serving governments, investors, and contractors across Africa, the Americas, and the Caribbean.",
      bullet1: "Sovereign advisory & project structuring",
      bullet2: "DFI engagement & capital mobilization",
      bullet3: "PPP design & concession management",
      bullet4: "End-to-end delivery oversight",
    },
    mvp: {
      sectionHeadline: "Mission, Vision & Purpose",
      sectionSubheadline: "Three commitments that define how we work — and why Zafora was built.",
      mission: "To structure bankable, deliverable infrastructure across Africa and emerging markets — connecting sovereign governments, development finance institutions, and private capital through trusted, execution-focused advisory.",
      vision: "To be recognized as the most trusted infrastructure advisory and development partner for African governments and global investors — setting the standard for transparent, impactful, and financially sustainable project delivery.",
      purpose: "To prove that infrastructure development in Africa can be transparent, scalable, and community-positive — and to build a replicable model that creates lasting economic value across generations.",
    },
    values: [
      { title: "Integrity First", desc: "Every engagement is conducted with full transparency, ethical rigor, and accountability to all stakeholders — governments, investors, and communities alike." },
      { title: "Pan-African Vision", desc: "We operate across borders with a deep understanding of Africa's political, economic, and regulatory landscapes — no market is too complex." },
      { title: "Partnership Model", desc: "We don't just advise — we co-create. Zafora sits at the table as a long-term partner, sharing risk and aligning incentives with every client." },
      { title: "Bankable Outcomes", desc: "We structure projects to meet international finance standards — making them attractive to multilaterals, DFIs, and institutional capital." },
      { title: "Execution Focus", desc: "Advisory without delivery is incomplete. We track projects from concept to commissioning, ensuring commitments become reality on the ground." },
      { title: "Excellence in Practice", desc: "We apply best-in-class global standards to every project — from technical due diligence to procurement frameworks and impact measurement." },
    ],
    team: [
      { initials: "ZH", name: "Executive Team", title: "Founder & Executive Leadership", bio: "Zafora's founding team drives the organization's strategic vision, senior government relationships, and capital mobilization mandates. The executive office oversees all active engagements and institutional partnerships across African and international markets.", location: "Tampa, FL, USA" },
      { initials: "ZH", name: "Advisory Panel", title: "Infrastructure Advisory Panel", bio: "Our advisory panel encompasses specialists in PPP structuring, DFI engagement, sovereign project finance, and ESG compliance. Advisors are drawn from across Sub-Saharan Africa, the Americas, and global financial and development institutions.", location: "Global" },
      { initials: "ZH", name: "Operations Team", title: "Operations & Project Delivery", bio: "The operations function governs every active engagement — managing project governance, compliance readiness, stakeholder coordination, and end-to-end delivery from origination through commissioning and handover.", location: "Tampa, FL, USA" },
      { initials: "ZH", name: "Global Partnerships", title: "Global Partnerships", bio: "Our partnerships function builds and manages relationships across sovereign governments, development finance institutions, institutional investors, international engineering contractors, and enterprise organizations throughout Africa and beyond.", location: "Global Markets" },
    ],
    timeline: [
      { year: "Jan 2025", event: "Zafora Holding established in Tampa, Florida. The company began developing its operational framework, brand identity, infrastructure advisory methodology, and foundational relationships with government and institutional counterparties." },
      { year: "Mid 2025", event: "Initiated market engagement and project origination activities across Sub-Saharan Africa, the Caribbean, and the Americas. Deepened focus on sovereign infrastructure advisory, PPP structuring, and DFI capital mobilization frameworks." },
      { year: "Late 2025", event: "Advanced strategic advisory mandates and began formalizing pipeline of infrastructure projects across energy, transport, water, and digital sectors. Strengthened institutional partnerships and compliance infrastructure." },
      { year: "2026", event: "Continuing to build strategic relationships and positioning for international opportunities involving infrastructure, technology, consulting, operational transformation, and global development initiatives across emerging and established markets." },
    ],
    cta: {
      headline: "Ready to bring your project to life?",
      subheadline: "Whether you're a government, investor, or contractor — we'd like to hear about your infrastructure ambitions.",
      btn1Text: "Start a Conversation", btn1Link: "/submit",
      btn2Text: "Explore the Pipeline", btn2Link: "/projects",
    },
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

// ── FAQs ───────────────────────────────────────────────────────────

router.get("/content/faqs", async (_req, res) => {
  const faqs = await db.select().from(faqsTable).orderBy(asc(faqsTable.displayOrder));
  res.json({ faqs });
});

router.post("/content/faqs", async (req, res) => {
  const body = req.body as any;
  const [faq] = await db.insert(faqsTable).values({
    question: body.question,
    answer: body.answer,
    category: body.category ?? "general",
    page: body.page ?? "general",
    displayOrder: body.displayOrder ?? 0,
    visible: body.visible ?? true,
  }).returning();
  res.status(201).json(faq);
});

router.patch("/content/faqs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [faq] = await db.update(faqsTable).set({
    ...(body.question !== undefined && { question: body.question }),
    ...(body.answer !== undefined && { answer: body.answer }),
    ...(body.category !== undefined && { category: body.category }),
    ...(body.page !== undefined && { page: body.page }),
    ...(body.displayOrder !== undefined && { displayOrder: body.displayOrder }),
    ...(body.visible !== undefined && { visible: body.visible }),
  }).where(eq(faqsTable.id, id)).returning();
  if (!faq) { res.status(404).json({ error: "Not found" }); return; }
  res.json(faq);
});

router.delete("/content/faqs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(faqsTable).where(eq(faqsTable.id, id));
  res.status(204).send();
});

export default router;
