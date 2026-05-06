import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  ShieldCheck, TrendingUp, Anchor, Landmark, Briefcase, Globe,
  ArrowRight, CheckCircle2, Zap, Droplets, Truck, Stethoscope,
  Users, DollarSign, Target, Award, ChevronRight,
} from "lucide-react";

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=900&q=80",
];

const iconMap: Record<string, React.ReactNode> = {
  Landmark: <Landmark className="h-7 w-7" />,
  ShieldCheck: <ShieldCheck className="h-7 w-7" />,
  Anchor: <Anchor className="h-7 w-7" />,
  TrendingUp: <TrendingUp className="h-7 w-7" />,
  Briefcase: <Briefcase className="h-7 w-7" />,
  Globe: <Globe className="h-7 w-7" />,
};

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

export default function Services() {
  usePageTitle("Services");
  const { data, isLoading } = useListServices();

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative pt-28 pb-0 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c59b4a]/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#173f35]/6 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pb-16 border-b border-[#e5ded3]">
            <div>
              <motion.div {...fadeInView()} className="inline-flex items-center gap-2 bg-[#efe3cf] text-[#173f35] px-3 py-1.5 rounded-full text-xs font-bold mb-7">
                <Briefcase className="h-3.5 w-3.5" /> Six Specialized Practices
              </motion.div>
              <motion.h1 {...fadeInView(0.1)} className="text-5xl md:text-6xl font-bold text-[#10231f] tracking-tight mb-6 leading-[1.06]">
                Advisory built for Africa's complexity.
              </motion.h1>
              <motion.p {...fadeInView(0.15)} className="text-xl text-[#65736f] leading-relaxed mb-8">
                Comprehensive structuring, funding, and delivery solutions — tailored to the political, economic, and regulatory realities of African infrastructure.
              </motion.p>
              <motion.div {...fadeInView(0.2)} className="flex flex-wrap gap-3">
                {[
                  { icon: <ShieldCheck className="h-4 w-4" />, label: "ESG-compliant" },
                  { icon: <DollarSign className="h-4 w-4" />, label: "DFI-ready" },
                  { icon: <Target className="h-4 w-4" />, label: "End-to-end" },
                  { icon: <Users className="h-4 w-4" />, label: "45+ experts" },
                ].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-sm font-semibold text-[#173f35] bg-[#f7f4ef] border border-[#e5ded3] px-4 py-2 rounded-full">
                    {item.icon} {item.label}
                  </span>
                ))}
              </motion.div>
            </div>
            {/* Hero image mosaic */}
            <motion.div {...fadeInView(0.15)} className="grid grid-cols-2 gap-4">
              <div className="h-72 rounded-[24px] overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80" alt="Services" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-[138px] rounded-[24px] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80" alt="Government" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="h-[118px] rounded-[24px] overflow-hidden shadow-lg bg-[#173f35] flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="text-3xl font-bold text-[#c59b4a]">6</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/70">Practices</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#173f35] py-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "$2.4B+", label: "Value Structured", icon: <DollarSign className="h-5 w-5" /> },
              { value: "12+", label: "Countries", icon: <Globe className="h-5 w-5" /> },
              { value: "45+", label: "Professionals", icon: <Users className="h-5 w-5" /> },
              { value: "100%", label: "Confidential", icon: <ShieldCheck className="h-5 w-5" /> },
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

      {/* Services Grid */}
      <section className="py-20 bg-[#f7f4ef]">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[600px] w-full rounded-[28px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {data?.services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  {...fadeInView(index * 0.08)}
                  className="group bg-white border border-[#e5ded3] rounded-[30px] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
                  data-testid={`card-service-${service.id}`}
                >
                  {/* Service image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={SERVICE_IMAGES[index % SERVICE_IMAGES.length]}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/70 via-[#10231f]/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 flex items-end gap-4">
                      <div className="w-12 h-12 bg-[#c59b4a] rounded-[14px] flex items-center justify-center text-[#10231f] shadow-lg shrink-0">
                        {iconMap[service.icon] || <Briefcase className="h-6 w-6" />}
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">{service.name}</h3>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <p className="text-lg text-[#65736f] mb-7 leading-relaxed">{service.description}</p>

                    <div className="bg-[#f7f4ef] rounded-[20px] p-6 mb-7 flex-1">
                      <h4 className="text-xs font-bold text-[#10231f] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#c59b4a]" /> Core Capabilities
                      </h4>
                      <ul className="space-y-3.5">
                        {service.bullets?.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 w-5 h-5 text-[#173f35] shrink-0" />
                            <span className="text-sm font-medium text-[#10231f]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/submit?service=${encodeURIComponent(service.name)}`}
                      className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-full bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-all shadow-md hover:shadow-lg mt-auto"
                    >
                      Request Consultation <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#173f35] to-[#245d4e] text-white rounded-[36px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
                <TrendingUp className="h-3.5 w-3.5" /> Ready to accelerate?
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Start with a confidential consultation.</h2>
              <p className="text-white/70 text-lg">Our advisors will assess your project and propose the most effective pathway forward.</p>
            </div>
            <Link href="/submit" className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-[#c59b4a] text-[#10231f] font-bold text-base hover:bg-[#b5893a] transition-all shadow-lg shrink-0 relative z-10">
              Start Conversation <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
