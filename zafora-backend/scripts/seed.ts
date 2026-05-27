/**
 * Seed script — populates Zafora DB with structural defaults.
 * Safe to re-run: clears all seeded tables before inserting.
 * Run: npx tsx scripts/seed.ts
 */

import "dotenv/config";
import { db } from "../src/db/index.js";
import { eq } from "drizzle-orm";
import {
  projectsTable,
  servicesTable,
  testimonialsTable,
  contentStatsTable,
  methodologyStepsTable,
  documentsTable,
  siteSettingsTable,
  leadsTable,
  faqsTable,
} from "../src/db/schema/index.js";

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── Preserve S3-backed image URLs before clearing ──────────────────
  // site_images and project/service imageUrls are populated by
  // upload-seed-images.ts. We save them here so a re-seed doesn't wipe them.
  const [existingSiteImages] = await db
    .select({ value: siteSettingsTable.value })
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, "site_images"))
    .limit(1);

  const existingProjectImages = await db
    .select({ name: projectsTable.name, imageUrl: projectsTable.imageUrl })
    .from(projectsTable);

  const existingServiceImages = await db
    .select({ name: servicesTable.name, imageUrl: servicesTable.imageUrl })
    .from(servicesTable);

  const savedProjectImages = Object.fromEntries(
    existingProjectImages
      .filter((p) => p.imageUrl)
      .map((p) => [p.name, p.imageUrl]),
  );

  const savedServiceImages = Object.fromEntries(
    existingServiceImages
      .filter((s) => s.imageUrl)
      .map((s) => [s.name, s.imageUrl]),
  );

  const savedSiteImagesValue = existingSiteImages?.value ?? null;

  // ── Clear all seeded tables (safe re-run) ──────────────────────────
  console.log("Clearing existing seeded data...");
  await db.delete(leadsTable);
  await db.delete(documentsTable);
  await db.delete(testimonialsTable);
  await db.delete(projectsTable);
  await db.delete(contentStatsTable);
  await db.delete(methodologyStepsTable);
  await db.delete(servicesTable);
  await db.delete(faqsTable);
  await db.delete(siteSettingsTable);
  console.log("  ✓ Tables cleared\n");

  // ── Projects ───────────────────────────────────────────────────────
  console.log("Inserting projects...");
  await db.insert(projectsTable).values([
    {
      name: "Rwanda Smart Grid Modernization",
      sector: "Energy",
      country: "Rwanda",
      region: "East Africa",
      fundingStatus: "seeking_funding",
      estimatedValue: "$95M",
      zaforaRole: "Funding Advisor",
      partnerNeed: "Technology Partner, Grid Operator",
      description: "National smart grid deployment replacing aging infrastructure and enabling renewable energy integration across all 30 districts.",
    },
    {
      name: "Mozambique LNG Access Roads",
      sector: "Transport",
      country: "Mozambique",
      region: "Southern Africa",
      fundingStatus: "funded",
      estimatedValue: "$65M",
      zaforaRole: "Contract Manager",
      partnerNeed: "",
      description: "Critical road infrastructure supporting LNG extraction operations in northern Mozambique, opening remote regions to economic activity.",
    },
    {
      name: "Lagos-Ibadan Healthcare Infrastructure",
      sector: "Healthcare",
      country: "Nigeria",
      region: "West Africa",
      fundingStatus: "government_review",
      estimatedValue: "$120M",
      zaforaRole: "Procurement Advisor",
      partnerNeed: "Healthcare Operator, Construction Firm",
      description: "Network of 12 district hospitals along the Lagos-Ibadan corridor serving a population of 4 million people.",
    },
    {
      name: "Nairobi Urban Water Resilience Program",
      sector: "Water & Sanitation",
      country: "Kenya",
      region: "East Africa",
      fundingStatus: "partially_funded",
      estimatedValue: "$85M",
      zaforaRole: "Project Manager",
      partnerNeed: "Engineering Firm, Government Co-Sponsor",
      description: "Rehabilitation and expansion of water infrastructure serving 1.2 million residents in Nairobi's informal settlements.",
    },
    {
      name: "Sahel Solar Energy Corridor",
      sector: "Energy",
      country: "Senegal",
      region: "West Africa",
      fundingStatus: "seeking_funding",
      estimatedValue: "$210M",
      zaforaRole: "Development Partner",
      partnerNeed: "Strategic Investor, Technical Partner",
      description: "A 150MW solar generation corridor spanning three communities in the Sahel region, providing clean energy to 600,000 residents.",
    },
    {
      name: "Lamu Port Expansion Phase II",
      sector: "Transport",
      country: "Kenya",
      region: "East Africa",
      fundingStatus: "investor_ready",
      estimatedValue: "$340M",
      zaforaRole: "Lead Advisor",
      partnerNeed: "EPC Contractor, DFI Co-Financier",
      description: "Expansion of the Lamu Port to increase container throughput capacity by 300%, supporting Kenya's status as an East African logistics hub.",
    },
  ]);
  console.log("  ✓ 6 projects inserted");

  // ── Services ───────────────────────────────────────────────────────
  console.log("Inserting services...");
  await db.insert(servicesTable).values([
    {
      name: "Government Advisory",
      icon: "Landmark",
      description: "Strategic advisory services for government agencies and ministries on infrastructure policy, procurement strategy, and project delivery frameworks.",
      bullets: [
        "Policy & regulatory framework design",
        "Public-private partnership structuring",
        "Infrastructure master planning",
        "Stakeholder engagement & facilitation",
      ],
      category: "Government",
      displayOrder: 1,
      visible: true,
    },
    {
      name: "Contracting & Procurement",
      icon: "Briefcase",
      description: "End-to-end contracting and procurement support, ensuring compliance, value for money, and transparent selection of contractors and vendors.",
      bullets: [
        "Tender documentation & bid evaluation",
        "Contractor prequalification",
        "Contract negotiation & management",
        "Compliance & audit support",
      ],
      category: "Advisory",
      displayOrder: 2,
      visible: true,
    },
    {
      name: "Project Development",
      icon: "TrendingUp",
      description: "Comprehensive project development services from feasibility through financial close, covering technical, financial, and regulatory dimensions.",
      bullets: [
        "Feasibility studies & scoping",
        "Environmental & social impact assessment",
        "Technical due diligence",
        "Project structuring & bankability",
      ],
      category: "Development",
      displayOrder: 3,
      visible: true,
    },
    {
      name: "Funding Advisory",
      icon: "Anchor",
      description: "Access to DFI, multilateral, and private capital through our extensive network of funding partners across Africa and globally.",
      bullets: [
        "DFI & multilateral engagement (AfDB, World Bank, IFC)",
        "Blended finance structuring",
        "Grant & concessional finance access",
        "Investor roadshows & capital raising",
      ],
      category: "Advisory",
      displayOrder: 4,
      visible: true,
    },
    {
      name: "Project Management Support",
      icon: "ShieldCheck",
      description: "On-the-ground project management and oversight services ensuring delivery on time, on budget, and to specification.",
      bullets: [
        "Programme management office (PMO) setup",
        "Progress monitoring & reporting",
        "Risk management & mitigation",
        "Quality assurance frameworks",
      ],
      category: "Delivery",
      displayOrder: 5,
      visible: true,
    },
    {
      name: "Market Entry Consulting",
      icon: "Globe",
      description: "Enabling international firms and investors to enter African markets with confidence through local intelligence and network access.",
      bullets: [
        "Market assessment & opportunity mapping",
        "Regulatory navigation",
        "Local partner identification",
        "Business licensing & registration support",
      ],
      category: "Consulting",
      displayOrder: 6,
      visible: true,
    },
  ]);
  console.log("  ✓ 6 services inserted");

  // ── Content Stats ──────────────────────────────────────────────────
  console.log("Inserting content stats...");
  await db.insert(contentStatsTable).values([
    { label: "Regional Coverage", value: "Pan-African", suffix: "", description: "Active across Sub-Saharan Africa, the Americas, and the Caribbean", iconName: "Globe", displayOrder: 1, visible: true },
    { label: "Project Lifecycle", value: "End-to-End", suffix: "", description: "From origination and structuring through delivery and handover", iconName: "TrendingUp", displayOrder: 2, visible: true },
    { label: "Infrastructure Sectors", value: "6", suffix: "", description: "Energy, Water, Transport, Healthcare, Digital, and Agriculture", iconName: "Briefcase", displayOrder: 3, visible: true },
    { label: "Core Service Pillars", value: "3", suffix: "", description: "Government Advisory, Project Finance, and Execution Oversight", iconName: "Award", displayOrder: 4, visible: true },
  ]);
  console.log("  ✓ 4 content stats inserted");

  // ── Methodology Steps ──────────────────────────────────────────────
  console.log("Inserting methodology steps...");
  await db.insert(methodologyStepsTable).values([
    {
      stepNumber: 1,
      title: "Origination & Screening",
      description: "Identifying viable national projects and conducting preliminary technical and economic viability assessments.",
      iconName: "Target",
      displayOrder: 1,
      visible: true,
    },
    {
      stepNumber: 2,
      title: "Feasibility & Structuring",
      description: "Developing bankable legal entities, ensuring ESG compliance, and establishing strong governance frameworks.",
      iconName: "ShieldCheck",
      displayOrder: 2,
      visible: true,
    },
    {
      stepNumber: 3,
      title: "Capital Raising",
      description: "Connecting projects with our global network of DFIs, sovereign wealth funds, and private equity.",
      iconName: "DollarSign",
      displayOrder: 3,
      visible: true,
    },
    {
      stepNumber: 4,
      title: "Procurement",
      description: "Transparent, competitive tendering to select world-class EPC contractors and technology partners.",
      iconName: "Handshake",
      displayOrder: 4,
      visible: true,
    },
    {
      stepNumber: 5,
      title: "Execution Oversight",
      description: "Stringent project management, milestone tracking, and quality assurance during construction.",
      iconName: "TrendingUp",
      displayOrder: 5,
      visible: true,
    },
    {
      stepNumber: 6,
      title: "Operations & Handover",
      description: "Ensuring smooth transition to operational phase with trained local personnel and O&M contracts.",
      iconName: "Award",
      displayOrder: 6,
      visible: true,
    },
  ]);
  console.log("  ✓ 6 methodology steps inserted");

  // ── FAQs ───────────────────────────────────────────────────────────
  console.log("Inserting FAQs...");
  await db.insert(faqsTable).values([
    {
      question: "What services does Zafora Holding offer?",
      answer: "Full-spectrum infrastructure advisory — project finance, PPP structuring, government advisory, investor origination, ESG due diligence, and green finance. We advise governments, developers, and institutional investors at every stage of the project lifecycle.",
      category: "services",
      page: "general",
      displayOrder: 1,
      visible: true,
    },
    {
      question: "Which countries do you operate in?",
      answer: "We are active across 34+ African countries spanning Sub-Saharan and North Africa, with a strong presence in West Africa (Nigeria, Ghana, Senegal), East Africa (Kenya, Ethiopia, Rwanda), and Southern Africa (South Africa, Zambia, Zimbabwe).",
      category: "general",
      page: "about",
      displayOrder: 2,
      visible: true,
    },
    {
      question: "How do I submit a project for review?",
      answer: "Use the Submit a Project form on our website. A senior advisor will review your submission within 48 business hours. Please include project type, country, estimated value, and your role (government, developer, or investor).",
      category: "process",
      page: "submit",
      displayOrder: 3,
      visible: true,
    },
    {
      question: "Do you work with governments directly?",
      answer: "Yes. We support ministries, sovereign wealth funds, and infrastructure agencies on national pipeline strategy, PPP procurement, and DFI engagement. Our government advisory practice covers feasibility through financial close.",
      category: "government",
      page: "government",
      displayOrder: 4,
      visible: true,
    },
    {
      question: "What are typical project sizes you advise on?",
      answer: "We advise on transactions ranging from $20M for early-stage feasibility studies through to $500M+ for sovereign-scale infrastructure programmes. Our sweet spot is $50M–$300M projects where structuring complexity is highest.",
      category: "investment",
      page: "projects",
      displayOrder: 5,
      visible: true,
    },
    {
      question: "What makes Zafora different from other advisory firms?",
      answer: "Zafora was purpose-built for Africa's infrastructure market. We combine transaction advisory expertise with deep government relationships and a proprietary network of DFIs, pension funds, and strategic investors specifically focused on African infrastructure.",
      category: "general",
      page: "general",
      displayOrder: 6,
      visible: true,
    },
    {
      question: "How are your advisory fees structured?",
      answer: "Advisory engagements are structured as retainer + success fee arrangements, calibrated to project size and complexity. We also offer pre-feasibility engagements on a fixed-fee basis. Contact us for a tailored proposal.",
      category: "process",
      page: "services",
      displayOrder: 7,
      visible: true,
    },
  ]);
  console.log("  ✓ 7 FAQs inserted");

  // ── Site Settings ──────────────────────────────────────────────────
  console.log("Inserting site settings...");
  await db
    .insert(siteSettingsTable)
    .values([
      {
        key: "hero",
        value: JSON.stringify({
          badge: "Strategic Infrastructure & Consulting · Est. 2025",
          headline: "Structuring, funding, and delivering high-impact projects.",
          subheadline: "Zafora Holding connects governments, investors, and contractors to develop and deliver critical infrastructure across Africa.",
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
        }),
      },
      {
        key: "footer",
        value: JSON.stringify({
          description: "U.S.-based strategic infrastructure, investment, and consulting company bridging global opportunities across Africa, the Americas, the Caribbean, and emerging markets worldwide.",
          email: "Office@zaforaholding.com",
          address: "3030 N Rocky Point Dr W, Suite 150\nTampa, FL 33607, USA",
          phone: "",
          copyright: "2026",
        }),
      },
      {
        key: "branding",
        value: JSON.stringify({
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
        }),
      },
      {
        key: "about",
        value: JSON.stringify({
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
            { firstName: "Executive", lastName: "Team", name: "", title: "Founder & Executive Leadership", department: "Executive Office", bio: "Zafora's founding team drives the organization's strategic vision, senior government relationships, and capital mobilization mandates. The executive office oversees all active engagements and institutional partnerships across African and international markets.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 1, status: "published" },
            { firstName: "Advisory", lastName: "Panel", name: "", title: "Infrastructure Advisory Panel", department: "Advisory", bio: "Our advisory panel encompasses specialists in PPP structuring, DFI engagement, sovereign project finance, and ESG compliance. Advisors are drawn from across Sub-Saharan Africa, the Americas, and global financial and development institutions.", location: "Global", photo: "", linkedin: "", email: "", visible: true, sortOrder: 2, status: "published" },
            { firstName: "Operations", lastName: "Team", name: "", title: "Operations & Project Delivery", department: "Operations", bio: "The operations function governs every active engagement — managing project governance, compliance readiness, stakeholder coordination, and end-to-end delivery from origination through commissioning and handover.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 3, status: "published" },
            { firstName: "Partnerships", lastName: "Team", name: "", title: "Global Partnerships", department: "Partnerships", bio: "Our partnerships function builds and manages relationships across sovereign governments, development finance institutions, institutional investors, international engineering contractors, and enterprise organizations throughout Africa and beyond.", location: "Global Markets", photo: "", linkedin: "", email: "", visible: true, sortOrder: 4, status: "published" },
          ],
          timeline: [
            { year: "Jan 2025", event: "Zafora Holding established in Tampa, Florida. The company began developing its operational framework, brand identity, infrastructure advisory methodology, and foundational relationships with government and institutional counterparties." },
            { year: "Mid 2025", event: "Initiated market engagement and project origination activities across Sub-Saharan Africa, the Caribbean, and the Americas. Deepened focus on sovereign infrastructure advisory, PPP structuring, and DFI capital mobilization frameworks." },
            { year: "Late 2025", event: "Advanced strategic advisory mandates and began formalizing pipeline of infrastructure projects across energy, transport, water, and digital sectors. Strengthened institutional partnerships and compliance infrastructure." },
            { year: "2026", event: "Actively building project pipeline, deepening government and investor relationships, and positioning Zafora as the premier advisory bridge between African sovereign ambition and global capital markets." },
          ],
          cta: {
            headline: "Ready to bring your project to life?",
            subheadline: "Whether you're a government, investor, or contractor — we'd like to hear about your infrastructure ambitions.",
            btn1Text: "Start a Conversation",
            btn1Link: "/submit",
            btn2Text: "Explore the Pipeline",
            btn2Link: "/projects",
          },
          teamHeadline: "Our Organization",
          teamSubheadline: "Senior advisors, operators, and partnership professionals aligned behind a single mandate: bankable, deliverable infrastructure.",
          teamLayout: "4",
        }),
      },
      {
        key: "seo_home",
        value: JSON.stringify({
          title: "Zafora Holding — Infrastructure Advisory for Africa",
          description: "Zafora Holding provides project finance, PPP, and transaction advisory services for infrastructure projects across Africa.",
          keywords: "infrastructure advisory Africa, project finance, PPP advisory, DFI",
        }),
      },
      {
        key: "seo_about",
        value: JSON.stringify({
          title: "About Zafora Holding — Infrastructure Advisory",
          description: "Learn about Zafora Holding's mission, team, and track record in African infrastructure advisory.",
          keywords: "Zafora Holding about, infrastructure advisory team, Africa",
        }),
      },
      {
        key: "seo_services",
        value: JSON.stringify({
          title: "Advisory Services — Zafora Holding",
          description: "Explore Zafora's full-spectrum infrastructure advisory services: project finance, PPP, ESG, green finance, and more.",
          keywords: "infrastructure advisory services, PPP advisory, project finance Africa",
        }),
      },
      {
        key: "seo_projects",
        value: JSON.stringify({
          title: "Infrastructure Pipeline — Zafora Holding",
          description: "Explore Zafora's active infrastructure project pipeline across energy, transport, water, and real estate in Africa.",
          keywords: "Africa infrastructure projects, investment pipeline, project finance",
        }),
      },
      {
        key: "seo_government",
        value: JSON.stringify({
          title: "Government Advisory — Zafora Holding",
          description: "Zafora Holding works with governments and ministries across Africa to structure, procure, and deliver infrastructure.",
          keywords: "government advisory Africa, PPP procurement, infrastructure ministry",
        }),
      },
      {
        key: "seo_submit",
        value: JSON.stringify({
          title: "Submit a Project — Zafora Holding",
          description: "Submit your infrastructure project or advisory inquiry to Zafora Holding.",
          keywords: "submit project, infrastructure advisory inquiry, Zafora contact",
        }),
      },
      {
        key: "navigation",
        value: JSON.stringify([
          { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
          { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
          { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
          { id: "gov", label: "Government Review", href: "/government-review", visible: true, openNewTab: false, order: 3 },
        ]),
      },
      {
        key: "services_page",
        value: JSON.stringify({
          hero: {
            headline: "Advisory built for Africa's complexity.",
            subheadline: "Comprehensive structuring, funding, and delivery solutions — tailored to the political, economic, and regulatory realities of African infrastructure.",
            badge: "Six Specialized Practices",
          },
        }),
      },
      {
        key: "government_page",
        value: JSON.stringify({
          hero: {
            headline: "Government Advisory & PPP Structuring",
            subheadline: "Supporting ministries and public agencies to plan, procure, and deliver infrastructure through bankable public-private partnerships.",
            badge: "Sovereign-Grade Advisory",
          },
        }),
      },
      {
        key: "submit_page",
        value: JSON.stringify({
          hero: {
            headline: "Submit a Project or Inquiry",
            subheadline: "Tell us about your project or advisory need. A senior Zafora advisor will respond within 48 business hours.",
            badge: "Confidential & No Obligation",
          },
          sidebar: {
            title: "Why work with Zafora?",
            whyBullets: [
              "34+ African markets covered",
              "DFI and institutional investor network",
              "Government-ready documentation",
              "Senior advisor response within 48h",
            ],
          },
        }),
      },
      {
        key: "announcement_bar",
        value: JSON.stringify({
          enabled: false,
          message: "Welcome to Zafora Holding — Africa's trusted infrastructure advisory partner.",
          link: "/submit",
          linkText: "Partner with us",
          dismissible: true,
          bgColor: "#173f35",
          textColor: "#ffffff",
        }),
      },
      {
        key: "maintenance_mode",
        value: JSON.stringify({
          enabled: false,
          headline: "We'll be back soon.",
          message: "We're performing scheduled maintenance. Please check back shortly.",
          showContactEmail: true,
          estimatedTime: "",
        }),
      },
      {
        key: "legal_privacy",
        value: JSON.stringify({
          title: "Privacy Policy",
          lastUpdated: "January 2025",
          content: "Zafora Holding is committed to protecting your privacy. This policy explains how we collect and use your information when you visit our website.\n\nWe collect information you voluntarily provide (name, email, company) and usage data. We use it to respond to inquiries and improve our services. We do not sell your personal data.\n\nContact us at Office@zaforaholding.com with any questions.",
        }),
      },
      {
        key: "legal_terms",
        value: JSON.stringify({
          title: "Terms of Service",
          lastUpdated: "January 2025",
          content: "By accessing this website you agree to these Terms of Service.\n\nAll content on this site is the property of Zafora Holding and protected by applicable laws. You may use this site for lawful purposes only.\n\nZafora Holding shall not be liable for any indirect or consequential damages arising from use of this site.\n\nContact us at Office@zaforaholding.com with any questions.",
        }),
      },
      {
        key: "section_visibility",
        value: JSON.stringify({
          home: { hero: true, ticker: true, stats: true, services: true, methodology: true, testimonial: true, projects: true, sectors: true, cta: true },
          about: { hero: true, stats: true, story: true, mvp: true, values: true, team: true, timeline: true, cta: true },
          services: { hero: true, stats: true, cards: true, cta: true },
          projects: { hero: true, filter: true, grid: true },
          government: { hero: true, stats: true, capability: true, framework: true, cta: true },
          submit: { hero: true, form: true, sidebar: true },
        }),
      },
      {
        key: "notifications",
        value: JSON.stringify({
          adminEmail: process.env["ADMIN_EMAIL"] ?? "Office@zaforaholding.com",
          notifyOnInquiry: true,
          notifyOnInterest: true,
        }),
      },
      {
        key: "site_images",
        value: JSON.stringify({
          home: {
            heroPanel: "",
            band1: "",
            band2: "",
            band3: "",
            pillar1: "",
            pillar2: "",
            pillar3: "",
            engage1: "",
            engage2: "",
            engage3: "",
            collage1: "",
            collage2: "",
            collage3: "",
            collage4: "",
          },
          services: { mosaicLeft: "", mosaicRight: "" },
          government: { heroImage: "", mainLeft: "", mainRight: "" },
        }),
      },
    ]);
  console.log("  ✓ Site settings inserted");

  // ── Restore S3 image URLs if they existed before the clear ─────────
  const hasRestorations =
    savedSiteImagesValue ||
    Object.keys(savedProjectImages).length > 0 ||
    Object.keys(savedServiceImages).length > 0;

  if (hasRestorations) {
    console.log("\nRestoring S3 image URLs...");

    if (savedSiteImagesValue) {
      await db
        .update(siteSettingsTable)
        .set({ value: savedSiteImagesValue })
        .where(eq(siteSettingsTable.key, "site_images"));
      console.log("  ✓ site_images S3 URLs restored");
    }

    for (const [name, imageUrl] of Object.entries(savedProjectImages)) {
      if (imageUrl) {
        await db
          .update(projectsTable)
          .set({ imageUrl })
          .where(eq(projectsTable.name, name));
      }
    }
    if (Object.keys(savedProjectImages).length > 0) {
      console.log(`  ✓ ${Object.keys(savedProjectImages).length} project image URLs restored`);
    }

    for (const [name, imageUrl] of Object.entries(savedServiceImages)) {
      if (imageUrl) {
        await db
          .update(servicesTable)
          .set({ imageUrl })
          .where(eq(servicesTable.name, name));
      }
    }
    if (Object.keys(savedServiceImages).length > 0) {
      console.log(`  ✓ ${Object.keys(savedServiceImages).length} service image URLs restored`);
    }
  }

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
