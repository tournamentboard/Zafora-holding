import { motion } from "framer-motion";
import { Link } from "wouter";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  Globe, ShieldCheck, Handshake, TrendingUp, Users, Building2,
  Landmark, Zap, Droplets, Truck, Stethoscope, ArrowRight,
  CheckCircle2, Target, Eye, Award, MapPin
} from "lucide-react";
import logo from "@/assets/logo.png";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const VALUES = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Integrity First",
    desc: "Every engagement is conducted with full transparency, ethical rigor, and accountability to all stakeholders — governments, investors, and communities alike.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Pan-African Vision",
    desc: "We operate across borders with a deep understanding of Africa's political, economic, and regulatory landscapes — no market is too complex.",
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: "Partnership Model",
    desc: "We don't just advise — we co-create. Zafora sits at the table as a long-term partner, sharing risk and aligning incentives with every client.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Bankable Outcomes",
    desc: "We structure projects to meet international finance standards — making them attractive to multilaterals, DFIs, and institutional capital.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Execution Focus",
    desc: "Advisory without delivery is incomplete. We track projects from concept to commissioning, ensuring commitments become reality on the ground.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Excellence in Practice",
    desc: "We apply best-in-class global standards to every project — from technical due diligence to procurement frameworks and impact measurement.",
  },
];

const STATS = [
  { value: "12+", label: "African Countries Active" },
  { value: "$2.4B+", label: "Project Value Advised" },
  { value: "6", label: "Infrastructure Sectors" },
  { value: "95%", label: "Client Retention Rate" },
];

const TEAM = [
  {
    initials: "AM",
    name: "Amara Mensah",
    title: "Founder & Chief Executive",
    bio: "20+ years in African infrastructure finance and government advisory. Former Principal at the African Development Bank.",
    location: "Accra, Ghana",
    color: "bg-[#173f35]",
  },
  {
    initials: "FK",
    name: "Fatima Kamara",
    title: "Managing Director, Transactions",
    bio: "Specialist in PPP structuring and DFI financing across energy and transport sectors. MBA, Wharton.",
    location: "Lagos, Nigeria",
    color: "bg-[#245d4e]",
  },
  {
    initials: "RO",
    name: "Raphael Osei",
    title: "Director, Government Advisory",
    bio: "Former Deputy Minister of Infrastructure with 15 years structuring national development programmes.",
    location: "Nairobi, Kenya",
    color: "bg-[#c59b4a]",
  },
  {
    initials: "ZN",
    name: "Zainab Ndoye",
    title: "Head of Capital Markets",
    bio: "Connects African projects with global institutional capital. Former VP at Standard Bank Group.",
    location: "Dakar, Senegal",
    color: "bg-[#10231f]",
  },
];

const SECTORS = [
  { icon: <Zap />, label: "Energy" },
  { icon: <Droplets />, label: "Water" },
  { icon: <Truck />, label: "Transport" },
  { icon: <Stethoscope />, label: "Healthcare" },
  { icon: <Building2 />, label: "Housing" },
  { icon: <Landmark />, label: "Digital" },
];

const MILESTONES = [
  { year: "2014", event: "Zafora Holding incorporated in Accra, Ghana, focused on public infrastructure advisory." },
  { year: "2016", event: "First cross-border project: $180M transport corridor advisory spanning Ghana and Côte d'Ivoire." },
  { year: "2018", event: "Established Government Review Center methodology, formalising compliance and bankability standards." },
  { year: "2020", event: "Expanded into East Africa; advised on $450M water access programme in Kenya and Tanzania." },
  { year: "2022", event: "Launched digital infrastructure practice. Portfolio exceeds $1.5B in total advised project value." },
  { year: "2024", event: "Active pipeline of 6 flagship projects spanning energy, healthcare, and smart infrastructure." },
];

export default function About() {
  usePageTitle("About Us");
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="pt-24 pb-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #f7f4ef 60%, #efe3cf 100%)" }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div {...fade(0)} className="inline-flex items-center gap-2 border border-[#173f35]/20 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#173f35] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173f35]" />
                About Zafora Holding
              </motion.div>
              <motion.h1 {...fade(0.1)} className="text-5xl md:text-6xl font-bold tracking-tight text-[#10231f] leading-[1.08] mb-6">
                Africa's infrastructure bridge — from vision to reality.
              </motion.h1>
              <motion.p {...fade(0.2)} className="text-xl text-[#65736f] leading-relaxed mb-10 max-w-xl">
                Zafora Holding is a pan-African infrastructure advisory and project development firm that connects sovereign governments, institutional investors, and world-class contractors to build the continent's future.
              </motion.p>
              <motion.div {...fade(0.3)} className="flex flex-wrap gap-4">
                <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#173f35] text-white font-semibold hover:bg-[#245d4e] transition-all shadow-md">
                  Work With Us <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#173f35] text-[#173f35] font-semibold hover:bg-[#173f35]/5 transition-all">
                  View Our Pipeline
                </Link>
              </motion.div>
            </div>

            {/* Stats panel */}
            <motion.div {...fade(0.25)} className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
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
                "We do not wait for Africa's infrastructure gap to close itself. We build the bridge — one bankable project at a time."
              </blockquote>
              <div className="text-white/60 text-sm font-medium relative z-10">— Amara Mensah, Founder & CEO</div>

              <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                {[
                  { label: "Founded", value: "2014" },
                  { label: "Headquarters", value: "Accra, Ghana" },
                  { label: "Team Size", value: "45+ professionals" },
                  { label: "Languages", value: "English, French, Arabic" },
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
                A firm built for Africa's infrastructure moment.
              </motion.h2>
              <motion.div {...fade(0.15)} className="space-y-4 text-[#65736f] leading-relaxed text-lg">
                <p>
                  Founded in 2014 and headquartered in Accra, Ghana, Zafora Holding brings together experts in project finance, government relations, engineering procurement, and institutional investment to deliver critical infrastructure across the continent.
                </p>
                <p>
                  We operate at the intersection of public policy and private capital — understanding the political constraints governments face, the risk requirements investors demand, and the execution realities contractors navigate.
                </p>
                <p>
                  Our team of 45+ professionals spans 12 African countries, providing both regional depth and continental reach that few advisory firms can match.
                </p>
              </motion.div>

              <motion.div {...fade(0.25)} className="mt-8 space-y-3">
                {[
                  "Project structuring that satisfies multilateral standards",
                  "Government-to-investor translation at every stage",
                  "On-the-ground presence across 12 countries",
                  "End-to-end advisory: feasibility to commissioning",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#173f35] shrink-0 mt-0.5" />
                    <span className="text-[#10231f] font-medium">{item}</span>
                  </div>
                ))}
              </motion.div>
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
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">Mission, Vision & Purpose</h2>
            <p className="text-[#65736f] text-lg">Everything we do flows from a single conviction: Africa's infrastructure future cannot wait.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Our Mission",
                icon: <Target className="h-7 w-7" />,
                color: "border-t-[#173f35]",
                bg: "bg-white",
                text: "To structure, fund, and deliver transformative infrastructure projects across Africa by bridging the gap between visionary governments, strategic investors, and world-class contractors.",
              },
              {
                label: "Our Vision",
                icon: <Eye className="h-7 w-7" />,
                color: "border-t-[#c59b4a]",
                bg: "bg-[#173f35] text-white",
                text: "An Africa where every citizen has access to modern, reliable infrastructure — and where no viable project fails simply for lack of a capable advisor at the table.",
              },
              {
                label: "Our Purpose",
                icon: <Globe className="h-7 w-7" />,
                color: "border-t-[#10231f]",
                bg: "bg-white",
                text: "To prove that African infrastructure development can be transparent, bankable, and community-positive — creating a template for responsible development at scale.",
              },
            ].map((card, i) => (
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
            {VALUES.map((v, i) => (
              <motion.div key={i} {...fade(i * 0.08)} className="group bg-[#f7f4ef] rounded-2xl p-7 border border-[#e5ded3] hover:border-[#173f35]/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#173f35] text-[#c59b4a] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {v.icon}
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
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">The team behind the work</h2>
            <p className="text-[#65736f] text-lg">Experienced operators who have led projects, not just advised on them.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className="bg-white rounded-2xl border border-[#e5ded3] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className={`${member.color} h-32 flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-white opacity-80">{member.initials}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#10231f] text-base mb-0.5">{member.name}</h3>
                  <div className="text-xs font-semibold text-[#c59b4a] mb-3">{member.title}</div>
                  <p className="text-[#65736f] text-xs leading-relaxed mb-3">{member.bio}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#8a958f]">
                    <MapPin className="h-3 w-3" /> {member.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div {...fade(0)} className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
              <TrendingUp className="h-3.5 w-3.5" /> Our Journey
            </div>
            <h2 className="text-4xl font-bold text-[#10231f] mb-4">A decade of infrastructure impact</h2>
            <p className="text-[#65736f] text-lg">From a single advisory mandate to a continent-wide practice.</p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-[52px] top-0 bottom-0 w-0.5 bg-[#e5ded3]" />

            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div key={i} {...fade(i * 0.08)} className="flex gap-8 items-start">
                  <div className="w-[104px] shrink-0 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#173f35] text-white flex items-center justify-center text-xs font-bold z-10 shrink-0">
                      {m.year.slice(2)}
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
            <h2 className="text-3xl font-bold text-[#10231f] mb-3">Sectors we operate in</h2>
            <p className="text-[#65736f]">Our practice covers the full breadth of African infrastructure needs.</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {SECTORS.map((s, i) => (
              <motion.div key={i} {...fade(i * 0.06)} className="bg-white rounded-2xl border border-[#e5ded3] p-5 flex flex-col items-center gap-3 hover:border-[#173f35]/40 hover:shadow-sm transition-all group">
                <div className="text-[#173f35] group-hover:scale-110 transition-transform">{s.icon}</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Ready to bring your project to life?</h2>
            <p className="text-white/70 text-xl mb-10 max-w-xl mx-auto">
              Whether you're a government, investor, or contractor — we'd like to hear about your infrastructure ambitions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#c59b4a] text-white font-bold text-base hover:bg-[#b5893a] transition-all shadow-lg">
                Start a Conversation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-bold text-base hover:bg-white/10 transition-all">
                Explore the Pipeline
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
