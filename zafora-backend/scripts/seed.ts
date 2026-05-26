/**
 * Seed script — populates Zafora DB with structural defaults.
 * Safe to re-run: clears all seeded tables before inserting.
 * Run: npx tsx scripts/seed.ts
 */

import "dotenv/config";
import { db } from "../src/db/index.js";
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
      name: "Project Finance Advisory",
      icon: "TrendingUp",
      description: "End-to-end structuring of infrastructure project finance — from feasibility to financial close.",
      bullets: [
        "Bankable feasibility studies",
        "Debt/equity structuring",
        "DFI and MDB engagement",
        "Financial model development",
      ],
      category: "Advisory",
      displayOrder: 1,
      visible: true,
    },
    {
      name: "PPP Transaction Advisory",
      icon: "Handshake",
      description: "Designing and executing public-private partnership frameworks that attract private capital to public infrastructure.",
      bullets: [
        "PPP feasibility & value-for-money analysis",
        "Tender document preparation",
        "Bid evaluation & negotiation support",
        "Contract management frameworks",
      ],
      category: "Advisory",
      displayOrder: 2,
      visible: true,
    },
    {
      name: "Government Infrastructure Strategy",
      icon: "Landmark",
      description: "Supporting ministries and agencies to prioritise, plan, and procure infrastructure at national and regional scale.",
      bullets: [
        "National infrastructure pipeline assessment",
        "Sector master planning",
        "Procurement strategy design",
        "Capacity building for government teams",
      ],
      category: "Government",
      displayOrder: 3,
      visible: true,
    },
    {
      name: "Investor Origination & Matchmaking",
      icon: "Users",
      description: "Connecting fundable projects with the right mix of institutional, development finance, and private equity investors.",
      bullets: [
        "Investor database & relationship management",
        "Investment teaser & memorandum preparation",
        "Roadshow coordination",
        "Term sheet negotiation support",
      ],
      category: "Investor Relations",
      displayOrder: 4,
      visible: true,
    },
    {
      name: "Environmental & Social Due Diligence",
      icon: "Leaf",
      description: "IFC Performance Standards-aligned ESDD to satisfy DFI requirements and mitigate project risk.",
      bullets: [
        "Environmental & Social Impact Assessment",
        "Stakeholder engagement planning",
        "E&S management system design",
        "Lender E&S monitoring reports",
      ],
      category: "Due Diligence",
      displayOrder: 5,
      visible: true,
    },
    {
      name: "Green & Sustainable Finance",
      icon: "Globe",
      description: "Structuring green bonds, sustainability-linked loans, and climate finance instruments for African issuers.",
      bullets: [
        "Green Bond Framework development (ICMA aligned)",
        "Second-party opinion coordination",
        "Climate risk assessment",
        "Impact reporting frameworks",
      ],
      category: "Sustainable Finance",
      displayOrder: 6,
      visible: true,
    },
  ]);
  console.log("  ✓ 6 services inserted");

  // ── Content Stats ──────────────────────────────────────────────────
  console.log("Inserting content stats...");
  await db.insert(contentStatsTable).values([
    { label: "Projects Advised", value: "120", suffix: "+", description: "Infrastructure projects across 30+ African countries", iconName: "Briefcase", displayOrder: 1, visible: true },
    { label: "Capital Mobilised", value: "$4.2B", suffix: "", description: "Total project finance closed or in advanced stage", iconName: "TrendingUp", displayOrder: 2, visible: true },
    { label: "Countries", value: "34", suffix: "+", description: "Active engagements across Sub-Saharan and North Africa", iconName: "Globe", displayOrder: 3, visible: true },
    { label: "Years of Experience", value: "18", suffix: "+", description: "Collective senior advisory experience on the continent", iconName: "Award", displayOrder: 4, visible: true },
    { label: "Government Partners", value: "47", suffix: "", description: "Ministries, agencies, and state-owned enterprises served", iconName: "Landmark", displayOrder: 5, visible: true },
    { label: "DFI Relationships", value: "22", suffix: "", description: "Active relationships with development finance institutions", iconName: "Building2", displayOrder: 6, visible: true },
  ]);
  console.log("  ✓ 6 content stats inserted");

  // ── Methodology Steps ──────────────────────────────────────────────
  console.log("Inserting methodology steps...");
  await db.insert(methodologyStepsTable).values([
    {
      stepNumber: 1,
      title: "Project Scoping & Diagnostic",
      description: "We conduct a rapid diagnostic to assess project readiness, identify key risks, and define the advisory scope — ensuring no engagement begins without a clear path to bankability.",
      iconName: "Search",
      displayOrder: 1,
      visible: true,
    },
    {
      stepNumber: 2,
      title: "Structuring & Modelling",
      description: "Our team develops the optimal financial structure, building a bankable financial model that stress-tests key assumptions and satisfies DFI and commercial lender requirements.",
      iconName: "BarChart2",
      displayOrder: 2,
      visible: true,
    },
    {
      stepNumber: 3,
      title: "Stakeholder & Regulator Alignment",
      description: "We engage government ministries, regulatory bodies, and local communities to secure the approvals, permits, and political support that de-risk the project for investors.",
      iconName: "Users",
      displayOrder: 3,
      visible: true,
    },
    {
      stepNumber: 4,
      title: "Investor Origination",
      description: "Leveraging our network of DFIs, MDBs, impact funds, and institutional investors, we identify the right capital partners and manage competitive investor outreach processes.",
      iconName: "Target",
      displayOrder: 4,
      visible: true,
    },
    {
      stepNumber: 5,
      title: "Negotiation & Documentation",
      description: "We lead or support negotiations on term sheets, loan agreements, shareholder agreements, and concession contracts — protecting our client's interests at every stage.",
      iconName: "FileCheck",
      displayOrder: 5,
      visible: true,
    },
    {
      stepNumber: 6,
      title: "Financial Close & Handover",
      description: "We manage the final conditions precedent, coordinate legal and financial close logistics, and provide a structured handover to the project implementation team.",
      iconName: "CheckCircle",
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
          badge: "Open for Engagement · Est. 2025",
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
          description: "Zafora Holding is a U.S.-based strategic infrastructure advisory and development firm connecting governments, investors, and contractors with large-scale infrastructure projects.",
          email: "Office@zaforaholding.com",
          address: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607, USA",
          phone: "",
          copyright: "2025",
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
            headline: "Built for Africa's Infrastructure Reality",
            subheadline: "Zafora Holding is a U.S.-based advisory firm purpose-built to structure, finance, and deliver infrastructure across Africa.",
          },
          story: "Zafora Holding was founded to address a critical gap in Africa's infrastructure market: the need for transaction advisors who understand both the complexity of DFI-financed deals and the political realities of African governments.\n\nWe operate at the intersection of capital markets, government strategy, and project delivery — bringing institutional-grade advisory to markets that have historically been underserved.",
          mission: "To accelerate Africa's infrastructure development by connecting governments, investors, and contractors with the advisory expertise needed to close transformative deals.",
          vision: "A continent where every bankable infrastructure project finds its capital.",
          team: [],
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
    ])
    .onConflictDoNothing();
  console.log("  ✓ Site settings inserted");

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
