import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield, FileCheck, Scale, Users, Target, Activity,
  ArrowRight, CheckCircle2, Globe, TrendingUp, Lock,
  Landmark, Award, BarChart3, ShieldCheck, Handshake,
} from "lucide-react";

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const criteria = [
  { title: "Legal Entity", desc: "Rigorous compliance checks and local incorporation readiness.", icon: <Shield className="h-6 w-6" />, color: "text-blue-600 bg-blue-50" },
  { title: "Track Record", desc: "Demonstrated track record of executing similar scale infrastructure.", icon: <Activity className="h-6 w-6" />, color: "text-purple-600 bg-purple-50" },
  { title: "Financial Strategy", desc: "Robust capital models securing long-term viability.", icon: <Target className="h-6 w-6" />, color: "text-green-600 bg-green-50" },
  { title: "Risk Controls", desc: "Comprehensive ESG, currency, and political risk mitigation.", icon: <Scale className="h-6 w-6" />, color: "text-orange-600 bg-orange-50" },
  { title: "Local Impact", desc: "Commitment to local content, job creation, and skills transfer.", icon: <Users className="h-6 w-6" />, color: "text-[#173f35] bg-[#f7f4ef]" },
  { title: "Execution Model", desc: "Clear delivery pathways, supply chains, and O&M planning.", icon: <FileCheck className="h-6 w-6" />, color: "text-[#c59b4a] bg-[#efe3cf]" },
];

const capabilities = [
  { icon: <Landmark className="h-5 w-5" />, title: "Policy-to-Project Translation", desc: "Converting national development goals into technically sound, bankable project structures." },
  { icon: <Globe className="h-5 w-5" />, title: "Multilateral DFI Liaison", desc: "Direct engagement with AfDB, World Bank, IFC, and regional development finance institutions." },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Sovereign Balance Sheet Protection", desc: "Structuring projects as SPVs to insulate government debt ratios while unlocking private capital." },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "ESG & Compliance Assurance", desc: "Full environmental, social, and governance compliance aligned with international standards." },
  { icon: <Handshake className="h-5 w-5" />, title: "PPP Design & Concession Management", desc: "Expert structuring of Public-Private Partnerships with fair risk allocation frameworks." },
  { icon: <Award className="h-5 w-5" />, title: "Procurement & Contractor Vetting", desc: "Transparent, competitive procurement ensuring value-for-money and delivery credibility." },
];

export default function Government() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        {/* Full-width hero image */}
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80"
            alt="Government advisory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10231f]/90 via-[#10231f]/70 to-[#10231f]/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-7"
                >
                  <Shield className="h-4 w-4 text-[#c59b4a]" /> Government Portal
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 leading-[1.06]"
                >
                  Government Review Center
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-white/75 leading-relaxed mb-8 max-w-xl"
                >
                  Zafora partners with sovereign governments to structure, derisk, and deliver national infrastructure agendas. We translate political vision into bankable, executable projects.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-wrap gap-3"
                >
                  <Link href="/submit?type=government" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#c59b4a] text-[#10231f] font-bold hover:bg-[#b5893a] transition-all shadow-lg">
                    Request Capability Pack <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/submit" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
                    Start a Project
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#173f35] py-10 border-b border-[#245d4e]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "12+", label: "Countries Served", icon: <Globe className="h-5 w-5" /> },
              { value: "$2.4B+", label: "Projects Structured", icon: <TrendingUp className="h-5 w-5" /> },
              { value: "100%", label: "DFI-Compatible", icon: <ShieldCheck className="h-5 w-5" /> },
              { value: "10+", label: "Years Experience", icon: <Award className="h-5 w-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="text-[#c59b4a]">{s.icon}</div>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#f7f4ef]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-14">

            <div className="space-y-16">
              {/* Capability statement */}
              <motion.div {...fadeInView()}>
                <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-6">
                  <Award className="h-3.5 w-3.5" /> Capability Statement
                </div>
                <h2 className="text-3xl font-bold text-[#10231f] mb-5">The critical bridge between state ambition and global capital.</h2>
                <div className="space-y-4 text-[#65736f] text-lg leading-relaxed">
                  <p>
                    As a premier African infrastructure advisory, Zafora Holding acts as the critical bridge between state requirements and global capital markets. We understand that government projects must balance rapid delivery with long-term fiscal prudence.
                  </p>
                  <p>
                    Our approach ensures that projects are structured as independent, commercially viable entities capable of attracting DFI funding and private capital, without overburdening sovereign balance sheets.
                  </p>
                </div>
              </motion.div>

              {/* Government capabilities */}
              <motion.div {...fadeInView(0.05)}>
                <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-7">
                  <Handshake className="h-3.5 w-3.5" /> What We Do for Governments
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {capabilities.map((cap, i) => (
                    <motion.div key={i} {...fadeInView(i * 0.06)} className="bg-white border border-[#e5ded3] rounded-[22px] p-6 hover:shadow-md hover:border-[#173f35]/30 transition-all">
                      <div className="w-10 h-10 bg-[#173f35] text-[#c59b4a] rounded-[12px] flex items-center justify-center mb-4 shadow-sm">
                        {cap.icon}
                      </div>
                      <h3 className="font-bold text-[#10231f] mb-2">{cap.title}</h3>
                      <p className="text-sm text-[#65736f] leading-relaxed">{cap.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Evaluation Framework */}
              <motion.div {...fadeInView()}>
                <div className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-7">
                  <Target className="h-3.5 w-3.5" /> Evaluation Framework
                </div>
                <h2 className="text-3xl font-bold text-[#10231f] mb-3">How we assess every project</h2>
                <p className="text-[#65736f] mb-8">Zafora applies a rigorous 6-pillar evaluation framework before advancing any project into our pipeline.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {criteria.map((item, i) => (
                    <motion.div key={i} {...fadeInView(i * 0.06)} className="bg-white border border-[#e5ded3] rounded-[22px] p-6 hover:shadow-md hover:border-[#173f35]/30 transition-all flex gap-4">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#10231f] mb-1">{item.title}</h3>
                        <p className="text-sm text-[#65736f] leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Image row */}
              <motion.div {...fadeInView()} className="grid grid-cols-2 gap-5">
                <div className="h-64 rounded-[24px] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80" alt="Infrastructure" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-64 rounded-[24px] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80" alt="Government" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <motion.div {...fadeInView()} className="bg-[#173f35] rounded-[28px] p-8 sticky top-28 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#c59b4a]/15 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-[#c59b4a] rounded-[14px] flex items-center justify-center mb-6 shadow-md">
                    <FileCheck className="w-6 h-6 text-[#10231f]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Request Capability Pack</h3>
                  <p className="text-white/65 mb-7 leading-relaxed text-sm">
                    Government ministries and sovereign wealth funds can request our full credentials, track record, and compliance documentation.
                  </p>
                  <Link href="/submit?type=government" className="w-full inline-flex items-center justify-center gap-2 h-13 py-3.5 rounded-full bg-[#c59b4a] text-[#10231f] font-bold hover:bg-[#b5893a] transition-all shadow-md mb-4">
                    Secure Access Request <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-white/40">
                    <Lock className="h-3.5 w-3.5" /> Processed via encrypted channel
                  </div>
                </div>
              </motion.div>

              {/* Trust signals */}
              <motion.div {...fadeInView(0.1)} className="bg-white border border-[#e5ded3] rounded-[28px] p-7">
                <h4 className="font-bold text-[#10231f] mb-5 text-sm uppercase tracking-wider">Our Commitments</h4>
                <ul className="space-y-4">
                  {[
                    "Full confidentiality on all submitted materials",
                    "Response within 48 business hours",
                    "No obligation preliminary assessment",
                    "Senior advisor assignment from day one",
                    "Alignment with African Union frameworks",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#65736f]">
                      <CheckCircle2 className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Sectors covered */}
              <motion.div {...fadeInView(0.15)} className="bg-[#f7f4ef] border border-[#e5ded3] rounded-[28px] p-7">
                <h4 className="font-bold text-[#10231f] mb-5 text-sm uppercase tracking-wider">Sectors Covered</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: <TrendingUp className="h-4 w-4" />, label: "Energy & Power" },
                    { icon: <Globe className="h-4 w-4" />, label: "Water & WASH" },
                    { icon: <BarChart3 className="h-4 w-4" />, label: "Transport" },
                    { icon: <ShieldCheck className="h-4 w-4" />, label: "Healthcare" },
                    { icon: <Award className="h-4 w-4" />, label: "Digital Infra" },
                    { icon: <Users className="h-4 w-4" />, label: "Social Housing" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#65736f] bg-white border border-[#e5ded3] rounded-xl px-3 py-2">
                      <span className="text-[#173f35]">{s.icon}</span> {s.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white border-t border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <motion.div {...fadeInView()}>
            <h2 className="text-4xl font-bold text-[#10231f] mb-5">Ready to advance your national agenda?</h2>
            <p className="text-xl text-[#65736f] mb-10">Begin with a confidential briefing. Our senior advisors will assess your project and propose the most bankable structure.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/submit?type=government" className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-all shadow-lg">
                Start a Confidential Briefing <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 h-14 px-8 rounded-full border border-[#e5ded3] text-[#65736f] font-semibold hover:border-[#173f35] hover:text-[#173f35] transition-all">
                View Active Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
