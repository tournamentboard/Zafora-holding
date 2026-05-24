/**
 * Seed script — populates Zafora DB with realistic dummy data.
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
} from "../src/db/schema/index.js";

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── Projects ──────────────────────────────────────────────────────
  console.log("Inserting projects...");
  await db.insert(projectsTable).values([
    {
      name: "Lagos Coastal Highway Expansion",
      sector: "Infrastructure",
      country: "Nigeria",
      region: "West Africa",
      fundingStatus: "seeking_funding",
      estimatedValue: "$340M",
      zaforaRole: "Lead Financial Advisor",
      partnerNeed: "EPC Contractor, DFI Co-funder",
      description: "A 78 km coastal expressway connecting Apapa Port to Lekki Free Trade Zone, reducing freight transit time by 60%.",
      interestCount: 14,
    },
    {
      name: "Nairobi Solar Power Plant — Phase II",
      sector: "Energy",
      country: "Kenya",
      region: "East Africa",
      fundingStatus: "partially_funded",
      estimatedValue: "$95M",
      zaforaRole: "Project Structuring & DFI Liaison",
      partnerNeed: "Solar EPC, Local Utility Partner",
      description: "200 MW utility-scale solar facility expanding Phase I capacity. IFC partial commitment secured; seeking co-investors.",
      interestCount: 22,
    },
    {
      name: "Accra Smart Water Distribution Network",
      sector: "Water & Sanitation",
      country: "Ghana",
      region: "West Africa",
      fundingStatus: "funded",
      estimatedValue: "$58M",
      zaforaRole: "Transaction Advisory",
      partnerNeed: "Operations & Maintenance Partner",
      description: "IoT-enabled water metering and distribution network serving 1.2 million residents in Greater Accra.",
      interestCount: 9,
    },
    {
      name: "Dar es Salaam Port Modernisation",
      sector: "Maritime & Logistics",
      country: "Tanzania",
      region: "East Africa",
      fundingStatus: "seeking_funding",
      estimatedValue: "$210M",
      zaforaRole: "PPP Structuring Advisor",
      partnerNeed: "Port Operator, Construction Firm",
      description: "Berth deepening, terminal automation, and cold-chain facility to position Dar es Salaam as East Africa's primary gateway port.",
      interestCount: 18,
    },
    {
      name: "Abidjan Affordable Housing — Phase I",
      sector: "Real Estate & Housing",
      country: "Côte d'Ivoire",
      region: "West Africa",
      fundingStatus: "partially_funded",
      estimatedValue: "$120M",
      zaforaRole: "Financial Structuring & Investor Origination",
      partnerNeed: "Local Developer, Impact Investor",
      description: "3,500 affordable housing units targeting civil servants and low-to-middle income households in Abidjan's Yopougon district.",
      interestCount: 11,
    },
    {
      name: "Lusaka–Livingstone Railway Rehabilitation",
      sector: "Transport",
      country: "Zambia",
      region: "Southern Africa",
      fundingStatus: "seeking_funding",
      estimatedValue: "$475M",
      zaforaRole: "Lead Advisory & Government Interface",
      partnerNeed: "Rolling Stock Supplier, Rail Operator",
      description: "Full rehabilitation of 460 km rail corridor to enhance freight capacity between Lusaka and the tourism-heavy Livingstone corridor.",
      interestCount: 7,
    },
    {
      name: "Addis Ababa Industrial Park Expansion",
      sector: "Industrial & Manufacturing",
      country: "Ethiopia",
      region: "East Africa",
      fundingStatus: "funded",
      estimatedValue: "$85M",
      zaforaRole: "Investment Facilitation",
      partnerNeed: "Light Manufacturing Tenants",
      description: "Expansion of the Bole Lemi Industrial Park with 45 new factory shells targeting textile and agro-processing investors.",
      interestCount: 31,
    },
    {
      name: "Casablanca Green Bond Framework",
      sector: "Finance & Capital Markets",
      country: "Morocco",
      region: "North Africa",
      fundingStatus: "closed",
      estimatedValue: "$150M",
      zaforaRole: "Green Bond Structuring & Verification",
      partnerNeed: "None — fully subscribed",
      description: "Morocco's first sovereign green bond aligned with ICMA Green Bond Principles, proceeds allocated to renewable energy and climate adaptation.",
      interestCount: 5,
    },
  ]).onConflictDoNothing();
  console.log("  ✓ 8 projects inserted");

  // ── Services ──────────────────────────────────────────────────────
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
  ]).onConflictDoNothing();
  console.log("  ✓ 6 services inserted");

  // ── Testimonials ──────────────────────────────────────────────────
  console.log("Inserting testimonials...");
  await db.insert(testimonialsTable).values([
    {
      name: "Dr. Amara Diallo",
      company: "Ministry of Finance, Guinea",
      role: "Director General, Infrastructure Finance",
      quote: "Zafora's advisory team navigated a highly complex multi-creditor structure for our road concession. Their depth of knowledge of DFI requirements was invaluable in reaching financial close within 18 months.",
      displayOrder: 1,
      visible: true,
    },
    {
      name: "Chidi Okonkwo",
      company: "Pan-African Infrastructure Fund",
      role: "Managing Partner",
      quote: "We have co-invested alongside Zafora-advised projects in four countries. Their transaction structuring is rigorous and their government relationships open doors that other advisors cannot.",
      displayOrder: 2,
      visible: true,
    },
    {
      name: "Fatima Al-Rashidi",
      company: "African Development Bank",
      role: "Principal Investment Officer",
      quote: "The quality of Zafora's project preparation work consistently meets AfDB's pre-appraisal standards. They are one of the few Africa-focused advisors that truly understands our internal processes.",
      displayOrder: 3,
      visible: true,
    },
    {
      name: "James Kariuki",
      company: "Kenya Power & Lighting Company",
      role: "Chief Finance Officer",
      quote: "Zafora structured our green bond framework from scratch, including coordinating the second-party opinion and investor roadshow. The bond was 1.8x oversubscribed at issuance.",
      displayOrder: 4,
      visible: true,
    },
    {
      name: "Nadia Mbeki",
      company: "South African National Treasury",
      role: "Head of PPP Unit",
      quote: "Their PPP transaction advisory on the Gauteng wastewater concession set a new benchmark for procurement transparency and bankability in our market.",
      displayOrder: 5,
      visible: true,
    },
  ]).onConflictDoNothing();
  console.log("  ✓ 5 testimonials inserted");

  // ── Content Stats ──────────────────────────────────────────────────
  console.log("Inserting content stats...");
  await db.insert(contentStatsTable).values([
    { label: "Projects Advised", value: "120", suffix: "+", description: "Infrastructure projects across 30+ African countries", iconName: "Briefcase", displayOrder: 1, visible: true },
    { label: "Capital Mobilised", value: "$4.2B", suffix: "", description: "Total project finance closed or in advanced stage", iconName: "TrendingUp", displayOrder: 2, visible: true },
    { label: "Countries", value: "34", suffix: "+", description: "Active engagements across Sub-Saharan and North Africa", iconName: "Globe", displayOrder: 3, visible: true },
    { label: "Years of Experience", value: "18", suffix: "+", description: "Collective senior advisory experience on the continent", iconName: "Award", displayOrder: 4, visible: true },
    { label: "Government Partners", value: "47", suffix: "", description: "Ministries, agencies, and state-owned enterprises served", iconName: "Landmark", displayOrder: 5, visible: true },
    { label: "DFI Relationships", value: "22", suffix: "", description: "Active relationships with development finance institutions", iconName: "Building2", displayOrder: 6, visible: true },
  ]).onConflictDoNothing();
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
  ]).onConflictDoNothing();
  console.log("  ✓ 6 methodology steps inserted");

  // ── Documents ──────────────────────────────────────────────────────
  console.log("Inserting documents...");
  await db.insert(documentsTable).values([
    {
      title: "Africa Infrastructure Outlook 2025",
      documentType: "Research Report",
      visibility: "public",
      description: "Annual analysis of infrastructure investment trends, funding gaps, and priority sectors across Sub-Saharan and North Africa.",
    },
    {
      title: "PPP Framework Guide for African Governments",
      documentType: "Policy Guide",
      visibility: "public",
      description: "Practical guide for government procurement teams on structuring bankable PPP transactions from inception to financial close.",
    },
    {
      title: "Zafora Holding — Corporate Profile 2025",
      documentType: "Company Profile",
      visibility: "public",
      description: "Overview of Zafora's advisory practice, sector expertise, track record, and senior team.",
    },
    {
      title: "DFI Engagement Handbook",
      documentType: "Advisory Note",
      visibility: "private",
      description: "Internal handbook covering application processes, requirements, and relationship management for 22 DFI and MDB partners.",
    },
    {
      title: "Green Bond Principles — Implementation Checklist",
      documentType: "Template",
      visibility: "public",
      description: "Step-by-step checklist aligned with ICMA Green Bond Principles for issuers seeking sustainable capital market instruments.",
    },
    {
      title: "Project Finance Modelling Standards",
      documentType: "Technical Standard",
      visibility: "private",
      description: "Internal modelling standards and assumptions guide for Zafora project finance engagements.",
    },
  ]).onConflictDoNothing();
  console.log("  ✓ 6 documents inserted");

  // ── Leads ──────────────────────────────────────────────────────────
  console.log("Inserting leads...");
  await db.insert(leadsTable).values([
    {
      fullName: "Emmanuel Kwarteng",
      organization: "Ghana Infrastructure Investment Fund",
      email: "e.kwarteng@giif.gov.gh",
      phone: "+233 30 291 0000",
      country: "Ghana",
      requestType: "consultation",
      projectSector: "Transport",
      message: "We are seeking advisory support on a toll road concession on the N1 corridor. Estimated investment $180M. We have government commitment but need help structuring for DFI financing.",
      budgetFundingNeed: "$180M",
      projectTimeline: "18–24 months",
      roleType: "Government",
      status: "qualified",
      notes: "Strong mandate. Schedule intro call with structuring team.",
    },
    {
      fullName: "Sophie Marchand",
      organization: "Meridian Impact Capital",
      email: "s.marchand@meridianimpact.com",
      phone: "+33 1 42 00 0000",
      country: "France",
      requestType: "partnership",
      projectSector: "Energy",
      message: "We are an impact fund with $600M AUM looking to deploy into African renewable energy. Interested in co-investment opportunities on Zafora-advised projects.",
      budgetFundingNeed: "Up to $50M per project",
      projectTimeline: "Ongoing",
      roleType: "Investor",
      status: "in_progress",
      notes: "Sent Nairobi Solar deck. Follow up on NDA.",
    },
    {
      fullName: "Brigadier Kwame Asante",
      organization: "Ministry of Works & Housing, Ghana",
      email: "k.asante@mowh.gov.gh",
      phone: "+233 30 266 4000",
      country: "Ghana",
      requestType: "government_advisory",
      projectSector: "Water & Sanitation",
      message: "Our ministry is preparing a PPP tender for water treatment in three regional capitals. We need an advisor experienced with IFC PS and AfDB procurement requirements.",
      budgetFundingNeed: "$75M",
      projectTimeline: "12 months to tender",
      roleType: "Government",
      status: "proposal_sent",
    },
    {
      fullName: "Aisha Conteh",
      organization: "Sierra Leone Investment Board",
      email: "a.conteh@slib.sl",
      phone: "+232 76 000 000",
      country: "Sierra Leone",
      requestType: "project_submission",
      projectSector: "Ports & Logistics",
      message: "We have a greenfield inland container depot project near Freetown Airport ready for private sector structuring. Government has allocated the land. Looking for a transaction advisor.",
      budgetFundingNeed: "$35M",
      projectTimeline: "24 months",
      roleType: "Government",
      status: "new",
    },
    {
      fullName: "Rajesh Patel",
      organization: "InfraAsia Partners",
      email: "r.patel@infraasia.com",
      phone: "+65 6880 0000",
      country: "Singapore",
      requestType: "partnership",
      projectSector: "Industrial & Manufacturing",
      message: "We are an Asian infrastructure fund looking to enter African markets through co-advisory or co-investment arrangements. Would like to explore collaboration.",
      budgetFundingNeed: "$100M–$500M",
      projectTimeline: "Strategic",
      roleType: "Investor",
      status: "reviewed",
    },
    {
      fullName: "Dr. Fatou Ndiaye",
      organization: "ECOWAS Commission",
      email: "f.ndiaye@ecowas.int",
      phone: "+229 21 31 0000",
      country: "Benin",
      requestType: "government_advisory",
      projectSector: "Energy",
      message: "ECOWAS is developing a regional power pool financing strategy. We need advisory support on the financial structuring of cross-border energy projects involving multiple member states.",
      budgetFundingNeed: "$500M+",
      projectTimeline: "36 months",
      roleType: "Government",
      status: "contacted",
    },
    {
      fullName: "Michael Acheampong",
      organization: "Volta River Authority",
      email: "m.acheampong@vra.com.gh",
      phone: "+233 30 221 6664",
      country: "Ghana",
      requestType: "funding",
      projectSector: "Energy",
      message: "We are exploring green bond issuance to fund our solar expansion programme. Interested in understanding structuring options and Zafora's experience in this space.",
      budgetFundingNeed: "$200M",
      projectTimeline: "9–12 months",
      roleType: "Government",
      status: "new",
    },
    {
      fullName: "Priya Sundaram",
      organization: "Global Infrastructure Partners",
      email: "p.sundaram@globalinfra.com",
      country: "United Kingdom",
      requestType: "consultation",
      projectSector: "Transport",
      message: "GIP is evaluating toll road opportunities in West Africa. We would like an introductory briefing on Zafora's current pipeline and advisory capabilities in this sector.",
      roleType: "Investor",
      status: "closed",
      notes: "Closed — no active mandate. Re-engage Q1 2026.",
    },
  ]).onConflictDoNothing();
  console.log("  ✓ 8 leads inserted");

  // ── Site Settings ──────────────────────────────────────────────────
  console.log("Inserting site settings...");
  await db.insert(siteSettingsTable).values([
    {
      key: "hero",
      value: JSON.stringify({
        headline: "Infrastructure Advisory for Africa's Next Chapter",
        subheadline: "Zafora Holding connects governments, developers, and investors to structure, finance, and close transformative infrastructure projects across the continent.",
        ctaLabel: "Explore Our Pipeline",
        ctaLink: "/projects",
        secondaryCtaLabel: "Submit a Project",
        secondaryCtaLink: "/submit",
      }),
    },
    {
      key: "footer",
      value: JSON.stringify({
        tagline: "Connecting capital to Africa's infrastructure ambitions.",
        address: "1 Finance Drive, Victoria Island, Lagos, Nigeria",
        email: "Office@zaforaholding.com",
        phone: "+234 1 700 0000",
        linkedinUrl: "https://linkedin.com/company/zaforaholding",
      }),
    },
    {
      key: "branding",
      value: JSON.stringify({
        primaryColor: "#173f35",
        accentColor: "#c59b4a",
        logoText: "Zafora Holding",
        tagline: "Infrastructure Advisory for Africa",
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
      key: "seo_projects",
      value: JSON.stringify({
        title: "Infrastructure Pipeline — Zafora Holding",
        description: "Explore Zafora's active infrastructure project pipeline across energy, transport, water, and real estate in Africa.",
        keywords: "Africa infrastructure projects, investment pipeline, project finance",
      }),
    },
    {
      key: "navigation",
      value: JSON.stringify([
        { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
        { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
        { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
        { id: "gov", label: "Government Review", href: "/government", visible: true, openNewTab: false, order: 3 },
      ]),
    },
  ]).onConflictDoNothing();
  console.log("  ✓ 6 site settings inserted");

  console.log("\n✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
