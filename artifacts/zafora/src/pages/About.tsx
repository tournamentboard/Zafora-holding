import { motion } from "framer-motion";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import { useGetSiteSettings } from "@workspace/api-client-react";
import {
  Globe, ShieldCheck, Handshake, TrendingUp, Users, Building2,
  Landmark, Zap, Droplets, Truck, Stethoscope, ArrowRight,
  CheckCircle2, Target, Eye, Award, MapPin, Linkedin, Mail
} from "lucide-react";
import logo from "@/assets/logo.png";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const VALUE_ICONS = [
  <ShieldCheck className="h-6 w-6" />,
  <Globe className="h-6 w-6" />,
  <Handshake className="h-6 w-6" />,
  <TrendingUp className="h-6 w-6" />,
  <Target className="h-6 w-6" />,
  <Award className="h-6 w-6" />,
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
  teamHeadline: "The team behind the work",
  teamSubheadline: "Experienced operators who have led projects, not just advised on them.",
  teamLayout: "4",
  team: [
    { initials: "ZH", name: "Leadership", title: "Executive Team", department: "Leadership", bio: "Zafora Holding's leadership brings deep expertise in infrastructure, strategic consulting, international business development, and global partnerships.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true },
    { initials: "ZH", name: "Advisory", title: "Strategic Advisors", department: "Advisory", bio: "Our advisory network spans infrastructure, government relations, technology, and international markets across Africa, the Americas, and beyond.", location: "Global", photo: "", linkedin: "", email: "", visible: true },
    { initials: "ZH", name: "Operations", title: "Operations Team", department: "Operations", bio: "Supporting project development, partnership management, compliance readiness, and day-to-day strategic execution across all active engagements.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true },
    { initials: "ZH", name: "Partnerships", title: "Global Partnerships", department: "Partnerships", bio: "Building and managing relationships with governments, contractors, investors, and enterprise organizations across emerging and developed markets.", location: "Global Markets", photo: "", linkedin: "", email: "", visible: true },
  ],
  hero: {
    headline: "Bridging global opportunities through infrastructure intelligence.",
    subheadline: "Zafora Holding is a U.S.-based strategic infrastructure, investment, and consulting company connecting governments, enterprises, investors, and contractors to scalable opportunities across global markets.",
    badge: "About Zafora Holding",
    btn1Text: "Work With Us", btn1Link: "/submit",
    btn2Text: "View Our Pipeline", btn2Link: "/projects",
  },
  stats: [
    { value: "2025", label: "Founded — Tampa, FL, USA" },
    { value: "5+", label: "Global Market Regions" },
    { value: "6", label: "Core Focus Areas" },
    { value: "Global", label: "Strategic Partnerships" },
  ],
  identity: {
    quote: "We bridge global opportunities through infrastructure intelligence, strategic partnerships, and technology-driven solutions — delivering long-term impact across emerging and developed markets.",
    quoteAttribution: "— Zafora Holding",
    founded: "January 2025",
    headquarters: "Tampa, FL, USA",
    contact: "Office@zaforaholding.com",
    markets: "Africa · Americas · Caribbean",
  },
  whoWeAre: {
    headline: "A company built for global infrastructure opportunities.",
    paragraph1: "Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holding was built with a vision to bridge global opportunities through infrastructure intelligence, strategic partnerships, technology-driven solutions, and international business development.",
    paragraph2: "We support public and private sector initiatives by connecting innovation, operational strategy, and scalable development opportunities across emerging and developed markets.",
    paragraph3: "Our organization is built around the belief that the future of infrastructure, technology, logistics, energy, communications, and smart development requires trusted partnerships, transparency, strategic execution, and long-term vision.",
    bullet1: "Strategic infrastructure development & modernization",
    bullet2: "Government & enterprise operational solutions",
    bullet3: "International partnerships across global markets",
    bullet4: "Technology-enabled development strategies",
  },
  mvp: {
    sectionHeadline: "Mission, Vision & Purpose",
    sectionSubheadline: "Everything we do flows from a single conviction: infrastructure development must be driven by trust, innovation, and execution excellence.",
    mission: "To create strategic global partnerships and deliver innovative infrastructure, technology, and development solutions that drive sustainable growth, operational efficiency, and long-term economic impact.",
    vision: "To become a globally recognized infrastructure and strategic solutions company that bridges international opportunities, emerging technologies, and large-scale development initiatives through trust, innovation, and execution excellence.",
    purpose: "To demonstrate that infrastructure development — across any market — can be transparent, scalable, and community-positive, creating a trusted template for responsible global development.",
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
    { year: "2025", event: "Zafora Holding established in Tampa, Florida. The company began developing its operational framework, brand identity, strategic partnerships, and long-term infrastructure vision focused on government, enterprise, and development opportunities." },
    { year: "Mid 2025", event: "Initiated relationship-building efforts and market research focused on infrastructure, technology, and development opportunities across Africa, the Caribbean, and emerging international markets. Expanded focus toward infrastructure intelligence, smart development, and strategic consulting." },
    { year: "Late 2025", event: "Began developing strategic initiatives involving infrastructure visibility systems, smart operational ecosystems, technology-enabled development strategies, and international business partnerships." },
    { year: "2026", event: "Continuing to build strategic relationships and positioning for international opportunities involving infrastructure, technology, consulting, operational transformation, and global development initiatives across emerging and established markets." },
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
  usePageTitle("About Us");
  const { data: settingsData } = useGetSiteSettings("about");

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
      <section className="pt-24 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #f7f4ef 60%, #efe3cf 100%)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div {...fade(0)} className="inline-flex items-center gap-2 border border-[#173f35]/20 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#173f35] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173f35]" />
                {d.hero.badge}
              </motion.div>
              <motion.h1 {...fade(0.1)} className="text-5xl md:text-6xl font-bold tracking-tight text-[#10231f] leading-[1.08] mb-6">
                {d.hero.headline}
              </motion.h1>
              <motion.p {...fade(0.2)} className="text-xl text-[#65736f] leading-relaxed mb-10 max-w-xl">
                {d.hero.subheadline}
              </motion.p>
              <motion.div {...fade(0.3)} className="flex flex-wrap gap-4">
                <Link href={d.hero.btn1Link} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#173f35] text-white font-semibold hover:bg-[#245d4e] transition-all shadow-md">
                  {d.hero.btn1Text} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={d.hero.btn2Link} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#173f35] text-[#173f35] font-semibold hover:bg-[#173f35]/5 transition-all">
                  {d.hero.btn2Text}
                </Link>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div {...fade(0.25)} className="grid grid-cols-2 gap-4">
              {d.stats.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e5ded3] p-6 shadow-sm text-center">
                  <div className="text-4xl font-bold text-[#173f35] mb-2">{s.value}</div>
                  <div className="text-sm text-[#65736f] font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Dark card */}
            <motion.div {...fade(0)} className="rounded-3xl bg-[#173f35] text-white p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
              <img src={logo} alt="Zafora Holding" className="h-14 w-auto mb-8 opacity-90" style={{ filter: "brightness(0) invert(1)" }} />
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
      <section className="py-24" style={{ background: "#f7f4ef" }}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-16">
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-16">
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
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </div>
                <h3 className="font-bold text-[#10231f] text-lg mb-2">{v.title}</h3>
                <p className="text-[#65736f] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24" style={{ background: "#f7f4ef" }}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-16">
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
            const visibleTeam = d.team.filter((m: any) => m.visible !== false);
            return (
              <div className={`grid ${gridClass} gap-5`}>
                {visibleTeam.map((member: any, i: number) => (
                  <motion.div key={i} {...fade(i * 0.1)} className="bg-white rounded-2xl border border-[#e5ded3] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    {member.photo ? (
                      <div className="h-36 overflow-hidden">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`${TEAM_COLORS[i % TEAM_COLORS.length]} h-36 flex items-center justify-center`}>
                        <span className="text-4xl font-bold text-white opacity-80">{member.initials}</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-[#10231f] text-base mb-0.5">{member.name}</h3>
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
                              <Linkedin className="h-3.5 w-3.5" />
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
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-16">
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
      <section className="py-20" style={{ background: "#f7f4ef" }}>
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-xl mx-auto mb-12">
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
      <section className="py-24 bg-[#173f35]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div {...fade(0)}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">{d.cta.headline}</h2>
            <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto">{d.cta.subheadline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={d.cta.btn1Link} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c59b4a] text-white font-bold text-base hover:bg-[#b5893a] transition-all shadow-lg">
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
