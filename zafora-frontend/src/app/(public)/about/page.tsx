"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import { usePageTitle } from "@/src/hooks/use-page-title";
import { parseSeoSettings } from "@/src/hooks/use-seo-meta";
import { useSiteSetting, useSectionVisibility, isSectionVisible } from "@/src/modules/public/home/services/home.service";
import {
  Globe, ShieldCheck, Handshake, TrendingUp, Users, Building2,
  Landmark, Zap, Droplets, Truck, Stethoscope, ArrowRight,
  CheckCircle2, Target, Eye, Award, MapPin, Mail, Calendar,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";

import logo from "@/src/assets/logo.png";
import Image from "next/image";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const VALUE_ICON_COMPONENTS = [ShieldCheck, Globe, Handshake, TrendingUp, Target, Award];

const STAT_ICONS_ABOUT = [
  { icon: <Calendar className="h-5 w-5" />, bg: "bg-[#173f35]", text: "text-[#c59b4a]" },
  { icon: <Globe className="h-5 w-5" />, bg: "bg-[#c59b4a]", text: "text-[#10231f]" },
  { icon: <Target className="h-5 w-5" />, bg: "bg-[#385c7a]", text: "text-white" },
  { icon: <Handshake className="h-5 w-5" />, bg: "bg-[#10231f]", text: "text-[#c59b4a]" },
];

const TEAM_COLORS = ["bg-[#173f35]", "bg-[#245d4e]", "bg-[#c59b4a]", "bg-[#10231f]"];

const SECTOR_ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap />, Droplets: <Droplets />, Truck: <Truck />,
  Stethoscope: <Stethoscope />, Building2: <Building2 />, Landmark: <Landmark />,
  Globe: <Globe />, ShieldCheck: <ShieldCheck />, TrendingUp: <TrendingUp />,
  Users: <Users />,
};

const DEFAULT_SECTORS = [
  { icon: "Zap", label: "Energy" },
  { icon: "Droplets", label: "Water" },
  { icon: "Truck", label: "Transport" },
  { icon: "Stethoscope", label: "Healthcare" },
  { icon: "Building2", label: "Housing" },
  { icon: "Landmark", label: "Digital" },
];

const DEFAULTS = {
  sectors: DEFAULT_SECTORS,
  sectorHeadline: "Sectors we operate in",
  sectorSubheadline: "Our practice spans critical infrastructure development across global markets.",
  teamHeadline: "Our Organization",
  teamSubheadline: "Senior advisors, operators, and partnership professionals aligned behind a single mandate: bankable, deliverable infrastructure.",
  teamLayout: "4",
  team: [
    { firstName: "Executive", lastName: "Team", name: "", title: "Founder & Executive Leadership", department: "Executive Office", bio: "Zafora's founding team drives the organization's strategic vision, senior government relationships, and capital mobilization mandates. The executive office oversees all active engagements and institutional partnerships across African and international markets.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 1, status: "published" },
    { firstName: "Advisory", lastName: "Panel", name: "", title: "Infrastructure Advisory Panel", department: "Advisory", bio: "Our advisory panel encompasses specialists in PPP structuring, DFI engagement, sovereign project finance, and ESG compliance. Advisors are drawn from across Sub-Saharan Africa, the Americas, and global financial and development institutions.", location: "Global", photo: "", linkedin: "", email: "", visible: true, sortOrder: 2, status: "published" },
    { firstName: "Operations", lastName: "Team", name: "", title: "Operations & Project Delivery", department: "Operations", bio: "The operations function governs every active engagement — managing project governance, compliance readiness, stakeholder coordination, and end-to-end delivery from origination through commissioning and handover.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 3, status: "published" },
    { firstName: "Partnerships", lastName: "Team", name: "", title: "Global Partnerships", department: "Partnerships", bio: "Our partnerships function builds and manages relationships across sovereign governments, development finance institutions, institutional investors, international engineering contractors, and enterprise organizations throughout Africa and beyond.", location: "Global Markets", photo: "", linkedin: "", email: "", visible: true, sortOrder: 4, status: "published" },
  ],
  hero: {
    headline: "Bridging global opportunities through infrastructure intelligence.",
    subheadline: "Zafora Holdings is a U.S.-based strategic infrastructure, investment, and consulting company connecting governments, enterprises, investors, and contractors to scalable opportunities across global markets.",
    badge: "About Zafora Holdings",
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
    quote: "We bridge global opportunities through infrastructure intelligence, strategic partnerships, and technology-driven solutions — delivering long-term impact across emerging and developed markets.",
    quoteAttribution: "— Zafora Holdings",
    founded: "January 2025",
    headquarters: "Tampa, FL, USA",
    contact: "office@zaforaholdings.com",
    markets: "Africa · Americas · Caribbean",
  },
  whoWeAre: {
    headline: "Built to close the gap between political ambition and investable infrastructure.",
    paragraph1: "Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holdings is a U.S.-based strategic infrastructure advisory and development firm. We were established to address a persistent gap in African infrastructure: the disconnect between government intent, investor appetite, and execution capability.",
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
  timeline: [
    { year: "Jan 2025", event: "Zafora Holdings established in Tampa, Florida. The company began developing its operational framework, brand identity, infrastructure advisory methodology, and foundational relationships with government and institutional counterparties." },
    { year: "Mid 2025", event: "Initiated market engagement and project origination activities across Sub-Saharan Africa, the Caribbean, and the Americas. Deepened focus on sovereign infrastructure advisory, PPP structuring, and DFI capital mobilization frameworks." },
    { year: "Late 2025", event: "Advanced strategic advisory mandates and began formalizing pipeline of infrastructure projects across energy, transport, water, and digital sectors. Strengthened institutional partnerships and compliance infrastructure." },
    { year: "2026", event: "Actively building project pipeline, deepening government and investor relationships, and positioning Zafora as the premier advisory bridge between African sovereign ambition and global capital markets." },
  ],
  cta: {
    headline: "Ready to bring your project to life?",
    subheadline: "Whether you're a government, investor, or contractor — we'd like to hear about your infrastructure ambitions.",
    btn1Text: "Start a Conversation", btn1Link: "/submit",
    btn2Text: "Explore the Pipeline", btn2Link: "/projects",
  },
};

function deepMerge(base: any, override: any): any {
  if (!override || typeof override !== "object") return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (Array.isArray(override[key])) {
      result[key] = override[key];
    } else if (typeof override[key] === "object" && !Array.isArray(override[key]) && typeof base[key] === "object" && !Array.isArray(base[key])) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export default function About() {
  const { data: seoData } = useSiteSetting("seo_about");
  usePageTitle("About Us", parseSeoSettings(seoData));
  const visibility = useSectionVisibility("about");
  const { data: settingsData } = useSiteSetting("about");

  let d = DEFAULTS;
  if (settingsData?.value) {
    try { d = deepMerge(DEFAULTS, JSON.parse(settingsData.value)); } catch {}
  }

  const mvpCards = [
    { label: "Our Mission", icon: <Target className="h-7 w-7" />, color: "border-t-[#173f35]", bg: "bg-white", text: d.mvp.mission },
    { label: "Our Vision", icon: <Eye className="h-7 w-7" />, color: "border-t-[#c59b4a]", bg: "bg-[#173f35] text-white", text: d.mvp.vision },
    { label: "Our Purpose", icon: <Globe className="h-7 w-7" />, color: "border-t-[#10231f]", bg: "bg-white", text: d.mvp.purpose },
  ];

  const bullets = [d.whoWeAre.bullet1, d.whoWeAre.bullet2, d.whoWeAre.bullet3, d.whoWeAre.bullet4].filter(Boolean);

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="bg-[#173f35] pt-20 pb-14 relative overflow-hidden" hidden={!isSectionVisible(visibility, "hero")}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c59b4a]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-3 py-1.5 rounded-full text-xs font-semibold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c59b4a]" />
                {d.hero.badge}
              </motion.div>
              <motion.h1 {...fade(0.1)} className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08] mb-6">
                {d.hero.headline}
              </motion.h1>
              <motion.p {...fade(0.2)} className="text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
                {d.hero.subheadline}
              </motion.p>
              <motion.div {...fade(0.3)} className="flex flex-wrap gap-4">
                <Link href={d.hero.btn1Link} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c59b4a] text-[#10231f] font-semibold hover:bg-[#b5893a] transition-all shadow-md">
                  {d.hero.btn1Text} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={d.hero.btn2Link} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
                  {d.hero.btn2Text}
                </Link>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div {...fade(0.25)} className="grid grid-cols-2 gap-4">
              {d.stats.map((s, i) => {
                const si = STAT_ICONS_ABOUT[i % STAT_ICONS_ABOUT.length];
                return (
                <div key={i} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5 text-center">
                  <div className={`w-11 h-11 rounded-xl ${si.bg} ${si.text} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                    {si.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-xs text-white/60 font-medium">{s.label}</div>
                </div>
              );})}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left — Dark card */}
            <motion.div {...fade(0)} className="rounded-3xl bg-[#173f35] text-white p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <Image src={logo} alt="Zafora Holdings" className="h-14 w-auto mb-8 opacity-90" style={{ filter: "brightness(0) invert(1)" }} />
              <blockquote className="text-2xl font-semibold leading-snug mb-6 relative z-10">
                "{d.identity.quote}"
              </blockquote>
              <div className="text-white/60 text-sm font-medium relative z-10">{d.identity.quoteAttribution}</div>

              <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                {[
                  { label: "Founded", value: d.identity.founded },
                  { label: "Headquarters", value: d.identity.headquarters },
                  { label: "Contact", value: d.identity.contact },
                  { label: "Markets", value: d.identity.markets },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <div className="text-white/50 text-xs mb-0.5">{item.label}</div>
                    <div className="font-semibold text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — text */}
            <div>
              <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
                <Users className="h-3.5 w-3.5" /> Who We Are
              </motion.div>
              <motion.h2 {...fade(0.1)} className="text-4xl font-bold text-[#10231f] mb-6 leading-tight">
                {d.whoWeAre.headline}
              </motion.h2>
              <motion.div {...fade(0.15)} className="space-y-4 text-[#65736f] leading-relaxed text-lg">
                {d.whoWeAre.paragraph1 && <p>{d.whoWeAre.paragraph1}</p>}
                {d.whoWeAre.paragraph2 && <p>{d.whoWeAre.paragraph2}</p>}
                {d.whoWeAre.paragraph3 && <p>{d.whoWeAre.paragraph3}</p>}
              </motion.div>

              {bullets.length > 0 && (
                <motion.div {...fade(0.25)} className="mt-8 space-y-3">
                  {bullets.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#173f35] shrink-0 mt-0.5" />
                      <span className="text-[#10231f] font-medium">{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14" style={{ background: "#f7f4ef" }} hidden={!isSectionVisible(visibility, "mvp")}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <Eye className="h-3.5 w-3.5" /> Purpose & Direction
            </div>
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">{d.mvp.sectionHeadline}</h2>
            <p className="text-[#65736f] text-lg">{d.mvp.sectionSubheadline}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mvpCards.map((card, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className={`rounded-2xl border-t-4 ${card.color} ${card.bg} p-8 shadow-sm border border-[#e5ded3]`}>
                <div className={`mb-5 ${card.bg.includes("173f35") ? "text-[#c59b4a]" : "text-[#173f35]"}`}>{card.icon}</div>
                <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${card.bg.includes("173f35") ? "text-white/50" : "text-[#8a958f]"}`}>{card.label}</div>
                <p className={`text-base leading-relaxed ${card.bg.includes("173f35") ? "text-white/90" : "text-[#65736f]"}`}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 bg-white" hidden={!isSectionVisible(visibility, "values")}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <ShieldCheck className="h-3.5 w-3.5" /> Our Values
            </div>
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">What guides every decision we make</h2>
            <p className="text-[#65736f] text-lg">These six values are not slogans — they are operating principles we are held accountable to.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {d.values.map((v, i) => (
              <motion.div key={i} {...fade(i * 0.08)} className="group bg-[#f7f4ef] rounded-2xl p-7 border border-[#e5ded3] hover:border-[#173f35]/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#173f35] text-[#c59b4a] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {(() => { const Icon = VALUE_ICON_COMPONENTS[i % VALUE_ICON_COMPONENTS.length]; return <Icon className="h-6 w-6" />; })()}
                </div>
                <h3 className="font-bold text-[#10231f] text-lg mb-2">{v.title}</h3>
                <p className="text-[#65736f] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-14" style={{ background: "#f7f4ef" }} hidden={!isSectionVisible(visibility, "team")}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <Users className="h-3.5 w-3.5" /> Leadership
            </div>
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">{d.teamHeadline ?? "The team behind the work"}</h2>
            <p className="text-[#65736f] text-lg">{d.teamSubheadline ?? "Experienced operators who have led projects, not just advised on them."}</p>
          </motion.div>

          {(() => {
            const layout = d.teamLayout ?? "4";
            const gridClass = layout === "2"
              ? "grid-cols-1 sm:grid-cols-2"
              : layout === "3"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
            const visibleTeam = [...d.team]
              .filter((m: any) => m.status !== "draft" && m.visible !== false)
              .sort((a: any, b: any) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
            return (
              <div className={`grid ${gridClass} gap-5`}>
                {visibleTeam.map((member: any, i: number) => {
                  const displayName = member.name || `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() || member.initials || "";
                  const autoInitials = member.initials || [member.firstName, member.lastName].filter(Boolean).map((s: string) => s[0]).join("").toUpperCase() || "ZH";
                  return (
                  <motion.div key={i} {...fade(i * 0.1)} className="bg-white rounded-2xl border border-[#e5ded3] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    {member.photo ? (
                      <div className="h-48 overflow-hidden">
                        <img src={member.photo} alt={displayName} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className={`${TEAM_COLORS[i % TEAM_COLORS.length]} h-48 flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
                        </div>
                        <span className="text-5xl font-bold text-white opacity-90 relative z-10">{autoInitials}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-[#10231f] text-base mb-0.5">{displayName}</h3>
                      <div className="text-xs font-semibold text-[#c59b4a] mb-0.5">{member.title}</div>
                      {member.department && member.department !== member.title && (
                        <div className="text-[11px] text-[#8a958f] mb-3">{member.department}</div>
                      )}
                      {!member.department && <div className="mb-3" />}
                      <p className="text-[#65736f] text-xs leading-relaxed mb-4">{member.bio}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-[#8a958f]">
                          <MapPin className="h-3 w-3" /> {member.location}
                        </div>
                        <div className="flex items-center gap-2">
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#8a958f] hover:text-[#0077b5] transition-colors" title="LinkedIn">
                              <FaLinkedinIn className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-[#8a958f] hover:text-[#173f35] transition-colors" title={member.email}>
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-14 bg-white" hidden={!isSectionVisible(visibility, "timeline")}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="h-3.5 w-3.5" /> Our Journey
            </div>
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">Building a Global Vision</h2>
            <p className="text-[#65736f] text-lg">From a bold founding vision to strategic global positioning.</p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-[52px] top-0 bottom-0 w-0.5 bg-[#e5ded3]" />
            <div className="space-y-8">
              {d.timeline.map((m, i) => (
                <motion.div key={i} {...fade(i * 0.08)} className="flex gap-8 items-start">
                  <div className="w-[104px] shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#173f35] text-white flex items-center justify-center text-xs font-bold z-10 shrink-0">
                      {m.year.slice(-2)}
                    </div>
                    <div className="text-sm font-bold text-[#173f35] mt-1">{m.year}</div>
                  </div>
                  <div className="bg-[#f7f4ef] rounded-2xl border border-[#e5ded3] p-5 flex-1 mt-1">
                    <p className="text-[#10231f] leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sectors We Serve */}
      <section className="py-12" style={{ background: "#f7f4ef" }}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-3xl font-bold text-[#10231f] mb-3">{d.sectorHeadline}</h2>
            <p className="text-[#65736f]">{d.sectorSubheadline}</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {(d.sectors ?? DEFAULT_SECTORS).map((s: any, i: number) => (
              <motion.div key={i} {...fade(i * 0.06)} className="bg-white rounded-2xl border border-[#e5ded3] p-5 flex flex-col items-center gap-3 hover:border-[#173f35]/40 hover:shadow-sm transition-all group">
                <div className="text-[#173f35] group-hover:scale-110 transition-transform">
                  {SECTOR_ICON_MAP[s.icon] ?? <Landmark />}
                </div>
                <span className="text-xs font-semibold text-[#65736f]">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-[#173f35]" hidden={!isSectionVisible(visibility, "cta")}>
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div {...fade(0)}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">{d.cta.headline}</h2>
            <p className="text-white/70 text-xl mb-7 max-w-xl mx-auto">{d.cta.subheadline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={d.cta.btn1Link} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c59b4a] text-[#10231f] font-bold text-base hover:bg-[#b5893a] transition-all shadow-lg">
                {d.cta.btn1Text} <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href={d.cta.btn2Link} className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-bold text-base hover:bg-white/10 transition-all">
                {d.cta.btn2Text}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
