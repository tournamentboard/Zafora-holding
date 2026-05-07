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

const FALLBACK_STATS = [
  { id: -1, label: "Project Value Advised", value: "$2.4B", suffix: "+", displayOrder: 0, visible: true },
  { id: -2, label: "African Countries Active", value: "12", suffix: "+", displayOrder: 1, visible: true },
  { id: -3, label: "Client Retention Rate", value: "95", suffix: "%", displayOrder: 2, visible: true },
  { id: -4, label: "Infrastructure Sectors", value: "6", suffix: "", displayOrder: 3, visible: true },
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
  heroPanel: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  band1: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
  band2: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
  band3: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
  pillar1: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=600&q=80",
  pillar2: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
  pillar3: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  engage1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  engage2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
  engage3: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=600&q=80",
  collage1: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
  collage2: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  collage3: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
  collage4: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
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
  panelStat: "1,240+",
  panelStatLabel: "Global inquiries",
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
                <Link href={hero.thirdBtnLink} className="inline-flex items-center gap-2 h-14 px-7 rounded-full bg-[#c59b4a] text-[#10231f] font-bold text-base hover:bg-[#b5893a] transition-all shadow-md">
                  {hero.thirdBtnText}
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
                {/* Live indicator */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  <span className="text-white text-[10px] font-semibold">Active Pipeline</span>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1.8fr] gap-4 relative z-10">
                {/* Stats mini card */}
                <div className="bg-white/10 backdrop-blur border border-white/15 rounded-[18px] p-5 flex flex-col justify-center">
                  <div className="text-white/60 text-xs font-semibold mb-2">Partner Interests</div>
                  <div className="text-4xl font-bold text-white tracking-tight mb-1">{hero.panelStat}</div>
                  <div className="text-sm font-semibold text-[#c59b4a]">{hero.panelStatLabel}</div>
                </div>

                {/* Project mini-list */}
                <div className="bg-white/5 border border-white/8 rounded-[18px] p-4 flex flex-col gap-2.5">
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Live Projects</div>
                  {projectsData?.projects?.slice(0, 3).map((p) => (
                    <Link key={p.id} href="/projects" className="group bg-white/6 hover:bg-white/12 border border-white/8 rounded-xl p-2.5 transition-all flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="text-sm font-bold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{p.sector} · {p.country}</div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wide font-bold px-2 py-1 rounded-lg bg-[#c59b4a]/20 text-[#c59b4a] whitespace-nowrap shrink-0">
                        {formatStatus(p.fundingStatus)}
                      </span>
                    </Link>
                  ))}
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
              <motion.div key={i} {...fadeInView(i * 0.1)} className="relative h-72 rounded-[28px] overflow-hidden group cursor-pointer">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
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
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#c59b4a] mb-2">
                  <BarChart3 className="h-6 w-6" />
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
                      <div className="w-10 h-10 rounded-xl bg-[#c59b4a]/20 border border-[#c59b4a]/30 flex items-center justify-center text-[#c59b4a]">
                        <Target className="h-5 w-5" />
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
              <div className="w-full aspect-square max-w-xs mx-auto lg:mx-0 rounded-[32px] overflow-hidden shadow-2xl">
                <img
                  src={featuredTestimonial?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"}
                  alt={featuredTestimonial?.clientName || "Leadership"}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#c59b4a] rounded-2xl p-4 shadow-xl">
                <div className="text-[#10231f] font-bold text-lg">10+</div>
                <div className="text-[#10231f]/70 text-xs font-semibold">Years Active</div>
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
                <MapPin className="h-3.5 w-3.5" /> Live Pipeline
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-3">Project Pipeline</h2>
              <p className="text-lg text-[#65736f]">High-impact infrastructure assets currently seeking partners.</p>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#e5ded3] text-[#10231f] font-semibold hover:border-[#173f35] hover:shadow-md transition-all whitespace-nowrap">
              View Entire Portfolio <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="bg-white rounded-[36px] p-8 border border-[#e5ded3] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projectsData?.projects?.slice(0, 3).map((project, i) => (
                <motion.div key={project.id} {...fadeInView(i * 0.08)} className="bg-[#f7f4ef] border border-[#e5ded3] rounded-[22px] p-6 flex flex-col hover:border-[#173f35]/30 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8a958f] border border-[#e5ded3] bg-white px-2 py-1 rounded-lg">
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
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT PATHS ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fadeInView()} className="text-center mb-10">
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
              <h2 className="text-4xl font-bold text-[#10231f] tracking-tight mb-6">A global infrastructure and strategic solutions company.</h2>
              <p className="text-lg text-[#65736f] leading-relaxed mb-6">
                Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holding was built to bridge global opportunities through infrastructure intelligence, strategic partnerships, and technology-driven solutions.
              </p>
              <p className="text-lg text-[#65736f] leading-relaxed mb-8">
                We support public and private sector initiatives across Africa, the Americas, the Caribbean, and emerging markets worldwide — connecting innovation with scalable development opportunities.
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
