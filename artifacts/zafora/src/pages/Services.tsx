import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, TrendingUp, Anchor, Landmark, Briefcase, Globe, ArrowUpRight, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Landmark": <Landmark className="h-7 w-7" />,
  "ShieldCheck": <ShieldCheck className="h-7 w-7" />,
  "Anchor": <Anchor className="h-7 w-7" />,
  "TrendingUp": <TrendingUp className="h-7 w-7" />,
  "Briefcase": <Briefcase className="h-7 w-7" />,
  "Globe": <Globe className="h-7 w-7" />
};

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <div className="flex flex-col pb-24 bg-[#f7f4ef]">
      {/* Header */}
      <section className="pt-24 pb-20 border-b border-[#e5ded3] bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-[#10231f] tracking-tight mb-6">Our Services</h1>
            <p className="text-xl text-[#65736f] leading-relaxed">
              Comprehensive advisory and development services for large-scale African infrastructure. 
              We bridge the gap between visionary governments, strategic investors, and world-class execution.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[500px] w-full rounded-[24px] bg-[#e5ded3]/50" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data?.services?.map((service, index) => {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white border border-[#e5ded3] rounded-[30px] overflow-hidden shadow-[0_12px_34px_rgba(16,35,31,0.04)] hover:border-[#173f35]/30 transition-all flex flex-col"
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="w-16 h-16 bg-[#f7f4ef] rounded-[16px] flex items-center justify-center mb-8 text-[#173f35]">
                      {iconMap[service.icon] || <Briefcase className="h-7 w-7" />}
                    </div>
                    
                    <h3 className="text-3xl font-bold text-[#10231f] mb-4 tracking-tight">{service.name}</h3>
                    <p className="text-lg text-[#65736f] mb-8 leading-relaxed">{service.description}</p>
                    
                    <div className="bg-[#f7f4ef] rounded-[20px] p-6 mb-8 flex-1">
                      <h4 className="text-sm font-bold text-[#10231f] uppercase tracking-wider mb-4">Core Capabilities</h4>
                      <ul className="space-y-4">
                        {service.bullets?.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 w-5 h-5 text-[#c59b4a] shrink-0" />
                            <span className="text-sm font-medium text-[#10231f]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button asChild className="w-full rounded-full bg-[#173f35] hover:bg-[#173f35]/90 text-white h-14 font-semibold text-base mt-auto">
                      <Link href={`/submit?service=${encodeURIComponent(service.name)}`}>
                        Request Consultation
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8 mt-8">
        <div className="bg-gradient-to-r from-[#173f35] to-[#245d4e] text-white rounded-[36px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to accelerate your project?</h2>
            <p className="text-white/80 text-lg">
              Engage our experts for a confidential consultation on your infrastructure requirements.
            </p>
          </div>
          <Button asChild size="lg" className="whitespace-nowrap rounded-full bg-white text-[#173f35] hover:bg-gray-100 h-14 px-8 font-bold text-base shadow-lg">
            <Link href="/submit">Start Conversation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
