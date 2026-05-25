import { useListProjects, useListServices, useListContentStats, useListMethodologySteps, useGetSiteSettings } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import { parseSeoSettings } from "@/hooks/use-seo-meta";
import {
  ArrowRight, Briefcase, Landmark, ShieldCheck, ArrowUpRight, BarChart3,
  Building, Globe, Zap, Droplets, Truck, Stethoscope, CheckCircle2,
  TrendingUp, Award, Users, Target, Handshake, MapPin, DollarSign,
  Wifi, Leaf, Home as HomeIcon, GraduationCap, ChevronRight,
} from "lucide-react";

const TICKER_ITEMS = [
  "Rwanda", "Nigeria", "Kenya", "Ghana", "Egypt", "Tanzania", "Ethiopia", "Senegal",
  "Côte d'Ivoire", "Uganda", "Mozambique", "Morocco", "Angola", "Cameroon",
  "Energy", "Water", "Transport", "Healthcare", "Digital", "Agriculture",
  "PPP Advisory", "Project Finance", "ESG Compliance", "DFI Funding",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "funded": return "bg-[#e5f5e9] text-[#173f35] border-[#173f35]/20";
    case "investor_ready": return "bg-[#e6eef4] text-[#385c7a] border-[#385c7a]/20";
    case "partially_funded": return "bg-[#f6ead2] text-[#c59b4a] border-[#c59b4a]/20";
    case "seeking_funding": return "bg-[#f7dfd9] text-[#b85c4b] border-[#b85c4b]/20";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const formatStatus = (status: string) =>
  status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const SERVICE_ICONS: Record<number, React.ReactNode> = {
  0: <Landmark className="w-7 h-7" />,
  1: <Briefcase className="w-7 h-7" />,
  2: <ShieldCheck className="w-7 h-7" />,
  3: <TrendingUp className="w-7 h-7" />,
  4: <Globe className="w-7 h-7" />,
  5: <Award className="w-7 h-7" />,
};

const HOME_STAT_ICONS: React.ReactNode[] = [
  <DollarSign className="h-6 w-6" />,
  <Globe className="h-6 w-6" />,
  <Users className="h-6 w-6" />,
  <Briefcase className="h-6 w-6" />,
];

const METHODOLOGY_ICONS: Record<string, React.ReactNode> = {
  Target:     <Target className="h-5 w-5" />,
  ShieldCheck:<ShieldCheck className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
  Handshake:  <Handshake className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Award:      <Award className="h-5 w-5" />,
  Globe:      <Globe className="h-5 w-5" />,
  Users:      <Users className="h-5 w-5" />,
  BarChart3:  <BarChart3 className="h-5 w-5" />,
  Briefcase:  <Briefcase className="h-5 w-5" />,
  Building:   <Building className="h-5 w-5" />,
};

const STEP_ACCENT_COLORS = [
  "bg-[#c59b4a]/20 border-[#c59b4a]/40 text-[#c59b4a]",
  "bg-[#7ab3d4]/20 border-[#7ab3d4]/30 text-[#7ab3d4]",
  "bg-[#6fbf8e]/20 border-[#6fbf8e]/30 text-[#6fbf8e]",
  "bg-[#c59b4a]/20 border-[#c59b4a]/40 text-[#c59b4a]",
  "bg-white/12 border-white/20 text-white/75",
  "bg-[#c59b4a]/20 border-[#c59b4a]/40 text-[#c59b4a]",
];

const getSectorStyle = (sector: string) => {
  const s = sector.split(",")[0].trim().toLowerCase();
  if (s === "energy") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "water") return "bg-sky-50 text-sky-700 border-sky-200";
  if (s === "transport") return "bg-violet-50 text-violet-700 border-violet-200";
  if (s === "healthcare") return "bg-rose-50 text-rose-700 border-rose-200";
  if (s === "digital") return "bg-teal-50 text-teal-700 border-teal-200";
  if (s === "agriculture") return "bg-green-50 text-green-700 border-green-200";
  return "bg-[#efe3cf] text-[#173f35] border-[#173f35]/20";
};

const FALLBACK_STATS = [
  { id: -1, label: "Regional Coverage", value: "Pan-African", suffix: "", displayOrder: 0, visible: true },
  { id: -2, label: "Project Lifecycle", value: "End-to-End", suffix: "", displayOrder: 1, visible: true },
  { id: -3, label: "Infrastructure Sectors", value: "6", suffix: "", displayOrder: 2, visible: true },
  { id: -4, label: "Core Service Pillars", value: "3", suffix: "", displayOrder: 3, visible: true },
];

const FALLBACK_STEPS = [
  { id: -1, stepNumber: 1, title: "Origination & Screening", description: "Identifying viable national projects and conducting preliminary technical and economic viability assessments.", iconName: "Target", displayOrder: 0, visible: true },
  { id: -2, stepNumber: 2, title: "Feasibility & Structuring", description: "Developing bankable legal entities, ensuring ESG compliance, and establishing strong governance frameworks.", iconName: "ShieldCheck", displayOrder: 1, visible: true },
  { id: -3, stepNumber: 3, title: "Capital Raising", description: "Connecting projects with our global network of DFIs, sovereign wealth funds, and private equity.", iconName: "DollarSign", displayOrder: 2, visible: true },
  { id: -4, stepNumber: 4, title: "Procurement", description: "Transparent, competitive tendering to select world-class EPC contractors and technology partners.", iconName: "Handshake", displayOrder: 3, visible: true },
  { id: -5, stepNumber: 5, title: "Execution Oversight", description: "Stringent project management, milestone tracking, and quality assurance during construction.", iconName: "TrendingUp", displayOrder: 4, visible: true },
  { id: -6, stepNumber: 6, title: "Operations & Handover", description: "Ensuring smooth transition to operational phase with trained local personnel and O&M contracts.", iconName: "Award", displayOrder: 5, visible: true },
];

const HOME_IMAGE_DEFAULTS = {
  heroPanel: "https://images.pexels.com/photos/3776969/pexels-photo-3776969.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
  band1: "https://images.pexels.com/photos/8761726/pexels-photo-8761726.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  band2: "https://images.pexels.com/photos/8124369/pexels-photo-8124369.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  band3: "https://images.pexels.com/photos/7698815/pexels-photo-7698815.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  pillar1: "https://images.pexels.com/photos/8487797/pexels-photo-8487797.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  pillar2: "https://images.pexels.com/photos/8550496/pexels-photo-8550496.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  pillar3: "https://images.pexels.com/photos/3894383/pexels-photo-3894383.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  engage1: "https://images.pexels.com/photos/8761656/pexels-photo-8761656.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  engage2: "https://images.pexels.com/photos/30688596/pexels-photo-30688596/free-photo-of-business-meeting-in-lagos-office-setting.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  engage3: "https://images.pexels.com/photos/3680959/pexels-photo-3680959.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
  collage1: "https://images.pexels.com/photos/8487795/pexels-photo-8487795.jpeg?auto=compress&cs=tinysrgb&w=400&q=80",
  collage2: "https://images.pexels.com/photos/1181415/pexels-photo-1181415.jpeg?auto=compress&cs=tinysrgb&w=400&q=80",
  collage3: "https://images.pexels.com/photos/5298215/pexels-photo-5298215.jpeg?auto=compress&cs=tinysrgb&w=400&q=80",
  collage4: "https://images.pexels.com/photos/9301297/pexels-photo-9301297.jpeg?auto=compress&cs=tinysrgb&w=400&q=80",
};

const HERO_DEFAULTS = {
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
};

export default function Home() {
  const { data: seoData } = useGetSiteSettings("seo_home");
  usePageTitle("Home", parseSeoSettings(seoData));
  const { data: projectsData } = useListProjects({ limit: 3 });
  const { data: servicesData } = useListServices();
  const { data: contentStatsData } = useListContentStats();
  const { data: methodologyData } = useListMethodologySteps();
  const { data: heroData } = useGetSiteSettings("hero");
  const { data: imagesData } = useGetSiteSettings("site_images");
  const { data: testimonialsData } = useQuery<{ testimonials: any[] }>({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });

  const hero = (() => {
    try {
      const parsed = heroData?.value ? JSON.parse(heroData.value) : null;
      if (parsed && typeof parsed === "object") return { ...HERO_DEFAULTS, ...parsed };
    } catch {}
    return HERO_DEFAULTS;
  })();

  const imgs = (() => {
    try {
      const parsed = imagesData?.value ? JSON.parse(imagesData.value) : null;
      if (parsed?.home) return { ...HOME_IMAGE_DEFAULTS, ...parsed.home };
    } catch {}
    return HOME_IMAGE_DEFAULTS;
  })();

  const featuredTestimonial = testimonialsData?.testimonials?.find((t: any) => t.visible !== false) ?? null;

  const siteStats = (contentStatsData?.stats?.filter(s => s.visible) ?? []).length > 0
    ? contentStatsData!.stats.filter(s => s.visible)
    : FALLBACK_STATS;

  const methodologySteps = (methodologyData?.steps?.filter(s => s.visible) ?? []).length > 0
    ? methodologyData!.steps.filter(s => s.visible)
    : FALLBACK_STEPS;

  return (
    <div className="flex flex-col overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="pt-20 pb-14 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#c59b4a]/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-48 w-96 h-96 bg-[#173f35]/6 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 border border-[#173f35]/20 bg-white px-4 py-2 rounded-full text-xs font-bold text-[#173f35] mb-5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#173f35] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#173f35]"></span>
                </span>
                {hero.badge}
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl lg:text-[78px] font-bold tracking-[-0.04em] text-[#10231f] leading-[1.04] mb-5">
                {hero.headline}
              </motion.h1>

              <motion.p {...fadeUp(0.2)} className="text-xl md:text-2xl text-[#65736f] mb-7 max-w-xl leading-relaxed">
                {hero.subheadline}
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3 mb-7">
                <Link href={hero.primaryBtnLink} className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  {hero.primaryBtnText} <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href={hero.secondaryBtnLink} className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-white border border-[#e5ded3] text-[#173f35] font-bold text-base hover:border-[#173f35] hover:shadow-md transition-all">
                  {hero.secondaryBtnText}
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-2 mb-7">
                {[
                  { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: hero.featureBadge1 },
                  { icon: <TrendingUp className="h-3.5 w-3.5" />, label: hero.featureBadge2 },
                  { icon: <Target className="h-3.5 w-3.5" />, label: hero.featureBadge3 },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173f35] bg-[#173f35]/8 border border-[#173f35]/15 px-3 py-1.5 rounded-full">
                    {item.icon} {item.label}
                  </span>
                ))}
              </motion.div>

              <motion.div {...fadeUp(0.5)} className="grid grid-cols-3 gap-6 pt-5 border-t border-[#e5ded3]">
                {siteStats.slice(0, 3).map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl lg:text-3xl font-bold text-[#173f35] tracking-tight mb-1">{s.value}{s.suffix}</div>
                    <div className="text-xs font-semibold text-[#8a958f] uppercase tracking-widest leading-tight">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Dark Green Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-gradient-to-br from-[#173f35] via-[#1a4a3e] to-[#0f2923] rounded-[36px] p-6 lg:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#c59b4a]/12 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#245d4e]/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

              {/* Hero image */}
              <div className="relative z-10 mb-5 h-[220px] rounded-[24px] overflow-hidden">
                <img
                  src={imgs.heroPanel}
                  alt="Infrastructure advisory"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/90 via-[#10231f]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 z-10">
                  <div className="text-[#c59b4a] text-xs font-bold uppercase tracking-wider mb-1">Executive Advisory</div>
                  <h3 className="text-white font-bold text-xl leading-tight">{hero.panelCaption}</h3>
                </div>
                {/* Status indicator */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c59b4a]"></span>
                  <span className="text-white text-[10px] font-semibold">Open for Engagement</span>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1.8fr] gap-4 relative z-10">
                {/* Stats mini card */}
                <div className="bg-white/10 backdrop-blur border border-white/15 rounded-[18px] p-5 flex flex-col justify-center">
                  <div className="text-white/60 text-xs font-semibold mb-2">Pipeline Status</div>
                  <div className="text-4xl font-bold text-white tracking-tight mb-1">{hero.panelStat}</div>
                  <div className="text-sm font-semibold text-[#c59b4a]">{hero.panelStatLabel}</div>
                </div>

                {/* Project mini-list */}
                <div className="bg-white/5 border border-white/8 rounded-[18px] p-4 flex flex-col gap-2.5">
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Project Pipeline</div>
                  {projectsData?.projects && projectsData.projects.length > 0 ? (
                    projectsData.projects.slice(0, 3).map((p) => (
                      <Link key={p.id} href="/projects" className="group bg-white/6 hover:bg-white/12 border border-white/8 rounded-xl p-2.5 transition-all flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="text-sm font-bold text-white truncate">{p.name}</div>
                          <div className="text-[10px] text-white/50 truncate">{p.sector} · {p.country}</div>
                        </div>
                        <span className="text-[9px] uppercase tracking-wide font-bold px-2 py-1 rounded-lg bg-[#c59b4a]/20 text-[#c59b4a] whitespace-nowrap shrink-0">
                          {formatStatus(p.fundingStatus)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <>
                      <div className="bg-white/6 border border-white/8 rounded-xl p-3 flex flex-col gap-1">
                        <div className="text-sm font-bold text-white/70">Pipeline under development</div>
                        <div className="text-[10px] text-white/40">Projects being onboarded</div>
                      </div>
                      <Link href="/submit" className="group bg-[#c59b4a]/15 hover:bg-[#c59b4a]/25 border border-[#c59b4a]/30 rounded-xl p-3 transition-all flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-[#c59b4a]">Submit a mandate</div>
                          <div className="text-[10px] text-white/40">Be among the first projects</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[#c59b4a] shrink-0" />
                      </Link>
                      <Link href="/projects" className="group bg-white/6 hover:bg-white/12 border border-white/8 rounded-xl p-2.5 transition-all flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-white/60">View pipeline</div>
                        <ArrowRight className="h-3.5 w-3.5 text-white/40 shrink-0" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SCROLLING TICKER ─────────────────────────────────────── */}
      <div className="py-4 bg-[#173f35] overflow-hidden border-y border-[#245d4e]">
        <div className="flex whitespace-nowrap">
          <div className="ticker-track flex items-center gap-0 shrink-0">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center text-white/70 text-sm font-semibold px-6">
                {item}
                <span className="ml-6 text-[#c59b4a] font-bold">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── IMAGE BAND ───────────────────────────────────────────── */}
      <section className="py-7">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                img: imgs.band1,
                label: "Government Advisory",
                tag: "Sovereign partnerships",
              },
              {
                img: imgs.band2,
                label: "Project Finance",
                tag: "DFI & private capital",
              },
              {
                img: imgs.band3,
                label: "Execution Oversight",
                tag: "Delivery excellence",
              },
            ].map((item, i) => (
              <motion.div key={i} {...fadeInView(i * 0.1)} className="relative h-80 rounded-[28px] overflow-hidden group cursor-pointer">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/85 via-[#10231f]/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#c59b4a] text-[#10231f] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">{item.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-white font-bold text-xl">{item.label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO WE SERVE ─────────────────────────────────────────── */}
      <section className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <Users className="h-3.5 w-3.5" /> Built for ecosystem leaders
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">Three pillars. One platform.</h2>
            <p className="text-xl text-[#65736f] max-w-2xl mx-auto">Zafora connects the critical actors that make infrastructure happen at scale.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Governments",
                desc: "Originate projects, structure concessions, and access global capital without overburdening sovereign debt.",
                icon: <Landmark className="w-8 h-8" />,
                img: imgs.pillar1,
                bullets: ["Policy-to-project structuring", "Sovereign balance sheet protection", "Multilateral DFI liaison"],
                color: "from-[#173f35] to-[#245d4e]",
              },
              {
                title: "Investors & DFIs",
                desc: "Access a curated pipeline of derisked, ESG-compliant infrastructure assets with clear yield parameters.",
                icon: <BarChart3 className="w-8 h-8" />,
                img: imgs.pillar2,
                bullets: ["Pre-screened bankable assets", "ESG & compliance verified", "Risk-adjusted return models"],
                color: "from-[#c59b4a] to-[#b5893a]",
              },
              {
                title: "Contractors & EPC",
                desc: "Discover bankable projects ready for execution, and partner with reputable global sponsors.",
                icon: <Building className="w-8 h-8" />,
                img: imgs.pillar3,
                bullets: ["Pre-qualified project pipeline", "Procurement facilitation", "Consortium formation support"],
                color: "from-[#10231f] to-[#1a3530]",
              },
            ].map((card, i) => (
              <motion.div key={i} {...fadeInView(i * 0.1)} className="bg-white rounded-[30px] overflow-hidden border border-[#e5ded3] shadow-sm hover:shadow-xl transition-all group">
                <div className={`relative h-48 bg-gradient-to-br ${card.color} overflow-hidden`}>
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 w-fit mb-3 text-white">{card.icon}</div>
                    <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-[#65736f] leading-relaxed mb-5">{card.desc}</p>
                  <ul className="space-y-2.5">
                    {card.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-[#10231f] font-medium">
                        <CheckCircle2 className="h-4 w-4 text-[#c59b4a] shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOLD STATS BAND ──────────────────────────────────────── */}
      <section className="bg-[#173f35] py-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#c59b4a] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {siteStats.map((s, i) => (
              <motion.div key={s.id} {...fadeInView(i * 0.08)} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#c59b4a]/20 border border-[#c59b4a]/30 flex items-center justify-center text-[#c59b4a] mb-2">
                  {HOME_STAT_ICONS[i % HOME_STAT_ICONS.length]}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{s.value}{s.suffix}</div>
                <div className="text-sm font-semibold text-white/60 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ─────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                <Briefcase className="h-3.5 w-3.5" /> Advisory & Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-3">End-to-end structuring, funding, and delivery.</h2>
              <p className="text-lg text-[#65736f]">Six specialized practices covering every phase of infrastructure development.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#173f35] text-[#173f35] font-semibold hover:bg-[#173f35] hover:text-white transition-all whitespace-nowrap">
              All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesData?.services?.slice(0, 3).map((service, i) => (
              <motion.div key={service.id} {...fadeInView(i * 0.1)} className="group bg-[#f7f4ef] border border-[#e5ded3] p-8 rounded-[24px] hover:border-[#173f35]/30 hover:shadow-lg transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#173f35]/4 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="w-14 h-14 bg-[#173f35] text-[#c59b4a] rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  {SERVICE_ICONS[i]}
                </div>
                <h3 className="text-xl font-bold text-[#10231f] mb-3">{service.name}</h3>
                <p className="text-[#65736f] mb-6 line-clamp-3">{service.description}</p>
                <ul className="space-y-2.5 mb-7">
                  {service.bullets?.slice(0, 3).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#10231f] font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#c59b4a] shrink-0 mt-0.5" /> {bullet}
                    </li>
                  ))}
                </ul>
                <Link href={`/submit?service=${encodeURIComponent(service.name)}`} className="inline-flex items-center gap-1.5 text-[#173f35] font-bold text-sm hover:gap-3 transition-all">
                  Engage Practice <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY MODEL ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-[#173f35] rounded-[40px] p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#c59b4a]/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                    <Target className="h-3.5 w-3.5" /> Our Methodology
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">The Delivery Model</h2>
                  <p className="text-xl text-white/60 max-w-xl">Our proprietary methodology derisks projects at every stage — from concept to commissioning.</p>
                </div>
                <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c59b4a] text-[#10231f] font-bold hover:bg-[#b5893a] transition-all shrink-0 shadow-lg">
                  Start a Project <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {methodologySteps.map((step, i) => (
                  <motion.div key={step.id} {...fadeInView(i * 0.07)} className="group flex gap-5">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${STEP_ACCENT_COLORS[i % STEP_ACCENT_COLORS.length]}`}>
                        {(step.iconName ? METHODOLOGY_ICONS[step.iconName] : null) ?? <Target className="h-5 w-5" />}
                      </div>
                      <div className="text-xs font-bold text-[#c59b4a]/60">{String(step.stepNumber).padStart(2, "0")}</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-white/55 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE / TESTIMONIAL ──────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-center max-w-5xl mx-auto">
            <motion.div {...fadeInView()} className="relative">
              {/* Global Presence Map Panel */}
              <div className="w-full max-w-xs mx-auto lg:mx-0 rounded-[32px] overflow-hidden shadow-2xl bg-[#0a1f1a] aspect-square relative">
                {/* SVG World Map — Africa-centered crop: viewBox 140 30 130 130 */}
                <svg
                  viewBox="140 30 130 130"
                  preserveAspectRatio="xMidYMid slice"
                  className="absolute inset-0 w-full h-full opacity-60"
                  aria-hidden="true"
                >
                  {/* Grid lines */}
                  {[45,90,135,180,225,270].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="white" strokeWidth="0.3" strokeOpacity="0.12" />
                  ))}
                  {[30,60,90,120,150].map(y => (
                    <line key={y} x1="0" y1={y} x2="360" y2={y} stroke="white" strokeWidth="0.3" strokeOpacity="0.12" />
                  ))}
                  {/* Africa */}
                  <path d="M 174,54 L 189,53 L 205,57 L 212,60 L 223,78 L 230,79 L 221,91 L 220,101 L 215,112 L 198,125 L 191,119 L 192,108 L 189,95 L 185,86 L 178,85 L 175,85 L 169,85 L 167,82 L 163,76 L 163,61 Z" fill="#1e5444" stroke="#c59b4a" strokeWidth="0.5" strokeOpacity="0.5" />
                  {/* Europe */}
                  <path d="M 171,46 L 175,30 L 208,19 L 204,31 L 212,44 L 208,53 L 194,54 L 174,54 Z" fill="#1a4035" stroke="none" />
                  {/* Arabian Peninsula */}
                  <path d="M 212,60 L 228,60 L 236,65 L 238,68 L 232,78 L 225,77 L 224,68 L 216,60 Z" fill="#1a4035" stroke="none" />
                  {/* Madagascar */}
                  <path d="M 224,104 L 228,101 L 230,110 L 226,116 Z" fill="#1e5444" stroke="none" />
                </svg>

                {/* Animated market dots — positions: left%=(lon+180-140)/130*100, top%=(90-lat-30)/130*100 */}
                {[
                  { city: "Lagos",        left: 33.4, top: 41.2, primary: true  },
                  { city: "Nairobi",      left: 59.1, top: 47.2, primary: true  },
                  { city: "Cairo",        left: 54.8, top: 23.0, primary: true  },
                  { city: "Johannesburg", left: 52.3, top: 66.3, primary: true  },
                  { city: "Dubai",        left: 73.3, top: 26.8, primary: false },
                  { city: "Accra",        left: 30.6, top: 41.9, primary: false },
                  { city: "Addis Ababa",  left: 60.5, top: 39.2, primary: false },
                  { city: "Kigali",       left: 53.9, top: 47.6, primary: false },
                  { city: "Dar es Salaam",left: 61.0, top: 51.4, primary: false },
                  { city: "London",       left: 30.7, top:  6.5, primary: false },
                  { city: "Dakar",        left: 17.4, top: 34.8, primary: false },
                  { city: "Casablanca",   left: 24.9, top: 20.3, primary: false },
                ].map((m, i) => (
                  <div
                    key={m.city}
                    className="absolute"
                    style={{ left: `${m.left}%`, top: `${m.top}%`, transform: "translate(-50%,-50%)" }}
                  >
                    {m.primary ? (
                      <div className="relative flex items-center justify-center">
                        <span className="absolute inline-flex rounded-full bg-[#c59b4a] opacity-60 animate-ping"
                          style={{ width: 14, height: 14, animationDuration: `${1.6 + i * 0.3}s` }} />
                        <span className="relative inline-flex rounded-full bg-[#c59b4a]" style={{ width: 8, height: 8 }} />
                      </div>
                    ) : (
                      <span className="inline-flex rounded-full bg-[#c59b4a]/70" style={{ width: 5, height: 5 }} />
                    )}
                  </div>
                ))}

                {/* Tampa HQ indicator (outside map crop, shown as corner label) */}
                <div className="absolute top-4 left-4 right-4 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-[#c59b4a] shrink-0" />
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Global Presence</span>
                </div>

                {/* Bottom market count strip */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1f1a] to-transparent pt-8 pb-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {["Nigeria","Kenya","Egypt","Ghana","Rwanda","Tanzania","Ethiopia","S. Africa","Senegal","Morocco"].map(c => (
                      <span key={c} className="text-[9px] font-semibold text-white/60 bg-white/8 border border-white/10 px-1.5 py-0.5 rounded-md">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#c59b4a] rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-[#10231f] font-bold text-sm leading-none">Pan-African</div>
                <div className="text-[#10231f]/70 text-xs font-semibold mt-0.5">Coverage</div>
              </div>
            </motion.div>
            <motion.div {...fadeInView(0.15)}>
              <div className="text-6xl text-[#c59b4a] font-serif leading-none mb-4">"</div>
              <p className="text-2xl md:text-3xl font-bold text-[#10231f] leading-snug mb-6 tracking-tight">
                {featuredTestimonial?.quote || "We bridge global opportunities through infrastructure intelligence, strategic partnerships, and technology-driven solutions — delivering long-term impact across emerging and developed markets."}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#173f35] flex items-center justify-center text-white font-bold text-lg">
                  {featuredTestimonial?.clientName ? featuredTestimonial.clientName.slice(0, 2).toUpperCase() : "ZH"}
                </div>
                <div>
                  <div className="font-bold text-[#10231f]">{featuredTestimonial?.clientName || "Zafora Holding"}</div>
                  <div className="text-sm text-[#65736f]">{featuredTestimonial?.clientTitle || "Tampa, FL, USA · Est. 2025"}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROJECT PIPELINE PREVIEW ─────────────────────────────── */}
      <section className="py-16 bg-[#f7f4ef]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                <MapPin className="h-3.5 w-3.5" /> Project Pipeline
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-3">Infrastructure Projects</h2>
              <p className="text-lg text-[#65736f]">Mandates under development and open for partner engagement.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#e5ded3] text-[#10231f] font-semibold hover:border-[#173f35] hover:shadow-md transition-all whitespace-nowrap">
              View Pipeline <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="bg-white rounded-[36px] p-8 border border-[#e5ded3] shadow-sm">
            {projectsData?.projects && projectsData.projects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {projectsData.projects.slice(0, 3).map((project, i) => (
                  <motion.div key={project.id} {...fadeInView(i * 0.08)} className="bg-[#f7f4ef] border border-[#e5ded3] rounded-[22px] p-6 flex flex-col hover:border-[#173f35]/30 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${getSectorStyle(project.sector)}`}>
                        {project.sector}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusColor(project.fundingStatus)}`}>
                        {formatStatus(project.fundingStatus)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#10231f] mb-1.5 leading-snug">{project.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-[#65736f] mb-5">
                      <MapPin className="h-3.5 w-3.5" /> {project.country}
                    </div>
                    <div className="bg-white rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Est. Value</div>
                        <div className="font-bold text-[#10231f] flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-[#173f35]" /> {project.estimatedValue || "TBD"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Zafora Role</div>
                        <div className="font-bold text-[#10231f] truncate">{project.zaforaRole}</div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#e5ded3]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8a958f]">
                        <Users className="h-3.5 w-3.5" /> {project.interestCount} interested
                      </div>
                      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173f35] hover:underline">
                        Express Interest <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#e5ded3] rounded-[24px]">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#173f35]/8 mb-4">
                  <BarChart3 className="h-7 w-7 text-[#173f35]" />
                </div>
                <h3 className="text-xl font-bold text-[#10231f] mb-2">Pipeline under development</h3>
                <p className="text-[#65736f] mb-6 max-w-sm mx-auto text-sm">We are actively onboarding infrastructure mandates. Projects will appear here as they are structured and validated.</p>
                <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-all text-sm">
                  Submit a Mandate <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT PATHS ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
              <Handshake className="h-3.5 w-3.5" /> Your Engagement Path
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">How would you like to engage?</h2>
            <p className="text-xl text-[#65736f]">Zafora works across the full infrastructure stakeholder ecosystem.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: imgs.engage1,
                tag: "For Governments",
                title: "Submit a Project",
                desc: "Sovereign entities and developers can submit infrastructure concepts for evaluation and structuring.",
                cta: "Start Submission",
                href: "/submit",
                btnClass: "bg-[#173f35] text-white",
              },
              {
                img: imgs.engage2,
                tag: "For Investors",
                title: "Invest & Fund",
                desc: "DFIs, private equity, and institutional investors can access our pipeline of bankable assets.",
                cta: "View Pipeline",
                href: "/projects",
                btnClass: "bg-[#c59b4a] text-[#10231f]",
              },
              {
                img: imgs.engage3,
                tag: "For Contractors",
                title: "Execution Partners",
                desc: "EPC contractors and operators can bid on structured projects and form delivery consortia.",
                cta: "Register Interest",
                href: "/submit",
                btnClass: "bg-white border border-[#e5ded3] text-[#10231f]",
              },
            ].map((card, i) => (
              <motion.div key={i} {...fadeInView(i * 0.1)} className="group bg-white rounded-[30px] overflow-hidden border border-[#e5ded3] shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur text-[#173f35] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">{card.tag}</span>
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-[#10231f] mb-3">{card.title}</h3>
                  <p className="text-[#65736f] mb-7 flex-1">{card.desc}</p>
                  <Link href={card.href} className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm ${card.btnClass} hover:opacity-90 transition-all shadow-sm`}>
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORS GRID ─────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
              <Globe className="h-3.5 w-3.5" /> Core Sectors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">We operate across six critical sectors</h2>
            <p className="text-xl text-[#65736f] max-w-2xl mx-auto">Every sector that drives African economic growth and human development.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Zap className="w-7 h-7" />, label: "Energy", sub: "Power grids, solar, gas", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
              { icon: <Droplets className="w-7 h-7" />, label: "Water", sub: "Treatment, sanitation", color: "bg-blue-50 text-blue-600 border-blue-200" },
              { icon: <Truck className="w-7 h-7" />, label: "Transport", sub: "Roads, rail, ports", color: "bg-purple-50 text-purple-600 border-purple-200" },
              { icon: <Stethoscope className="w-7 h-7" />, label: "Healthcare", sub: "Hospitals, clinics", color: "bg-red-50 text-red-500 border-red-200" },
              { icon: <Wifi className="w-7 h-7" />, label: "Digital", sub: "Broadband, smart city", color: "bg-teal-50 text-teal-600 border-teal-200" },
              { icon: <Leaf className="w-7 h-7" />, label: "Agriculture", sub: "Irrigation, storage", color: "bg-green-50 text-green-600 border-green-200" },
            ].map((s, i) => (
              <motion.div key={i} {...fadeInView(i * 0.07)} className={`group flex flex-col items-center gap-3 p-6 rounded-[24px] border ${s.color} hover:scale-105 transition-all cursor-default shadow-sm`}>
                <div className="group-hover:scale-110 transition-transform">{s.icon}</div>
                <div className="text-center">
                  <div className="font-bold text-[#10231f] text-sm">{s.label}</div>
                  <div className="text-[10px] text-[#8a958f] mt-0.5">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ─────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeInView()}>
              <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
                <Building className="h-3.5 w-3.5" /> Who We Are
              </div>
              <h2 className="text-4xl font-bold text-[#10231f] tracking-tight mb-6">A U.S.-based advisory firm purpose-built for African infrastructure.</h2>
              <p className="text-lg text-[#65736f] leading-relaxed mb-6">
                Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holding was established to close the gap between government infrastructure ambition and the capital, structure, and execution required to bring projects to life.
              </p>
              <p className="text-lg text-[#65736f] leading-relaxed mb-8">
                We operate at the intersection of public policy and private capital — structuring projects that attract DFI and institutional funding, meet international compliance standards, and deliver measurable impact across Africa, the Americas, and the Caribbean.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-all shadow-md">
                Our Full Story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div {...fadeInView(0.15)} className="grid grid-cols-2 gap-4">
              {[
                { img: imgs.collage1, className: "h-64 rounded-[24px]" },
                { img: imgs.collage2, className: "h-48 rounded-[24px] mt-8" },
                { img: imgs.collage3, className: "h-48 rounded-[24px] -mt-4" },
                { img: imgs.collage4, className: "h-64 rounded-[24px]" },
              ].map((img, i) => (
                <div key={i} className={`overflow-hidden shadow-lg ${img.className}`}>
                  <img src={img.img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#173f35] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c59b4a]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <motion.div {...fadeInView()}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-4 py-2 rounded-full text-xs font-bold mb-6">
              <Handshake className="h-4 w-4" /> Ready to build?
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-5 max-w-3xl mx-auto">
              Your next infrastructure project starts here.
            </h2>
            <p className="text-xl text-white/65 mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you represent a government, investment fund, or engineering firm — we want to hear about your ambitions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/submit" className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-[#c59b4a] text-[#10231f] font-bold text-base hover:bg-[#b5893a] transition-all shadow-xl hover:-translate-y-0.5">
                Start a Conversation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 h-14 px-10 rounded-full border border-white/25 text-white font-bold text-base hover:bg-white/10 transition-all">
                Explore Pipeline
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
