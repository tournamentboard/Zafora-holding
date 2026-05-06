import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, TrendingUp, Anchor, Landmark, Briefcase, Globe } from "lucide-react";
import serviceGov from "@/assets/service-gov.png";
import serviceProject from "@/assets/service-project.png";
import serviceFunding from "@/assets/service-funding.png";

const iconMap: Record<string, React.ReactNode> = {
  "Landmark": <Landmark className="h-8 w-8" />,
  "ShieldCheck": <ShieldCheck className="h-8 w-8" />,
  "Anchor": <Anchor className="h-8 w-8" />,
  "TrendingUp": <TrendingUp className="h-8 w-8" />,
  "Briefcase": <Briefcase className="h-8 w-8" />,
  "Globe": <Globe className="h-8 w-8" />
};

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <section className="bg-secondary py-20 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive advisory and development services for large-scale African infrastructure. 
              We bridge the gap between visionary governments, strategic investors, and world-class execution.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {data?.services?.map((service, index) => {
              const imageMap: Record<string, string> = {
                "Government Advisory": serviceGov,
                "Project Development": serviceProject,
                "Funding Advisory": serviceFunding
              };
              
              const defaultImage = serviceGov;
              const imgUrl = service.name in imageMap ? imageMap[service.name] : service.imageUrl || defaultImage;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:border-primary/50 transition-colors flex flex-col"
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="h-48 w-full overflow-hidden relative border-b border-border">
                    <img 
                      src={imgUrl} 
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute bottom-4 left-6 bg-primary/10 p-3 rounded-lg border border-primary/20 text-primary">
                      {iconMap[service.icon] || <Briefcase className="h-8 w-8" />}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-serif font-bold text-white mb-3">{service.name}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {service.bullets?.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-sm text-foreground/80">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                      <Link href={`/submit?service=${encodeURIComponent(service.name)}`}>Request Consultation</Link>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-8 mt-12">
        <div className="bg-primary text-primary-foreground rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to accelerate your project?</h2>
            <p className="text-primary-foreground/80 text-lg">
              Engage our experts for a confidential consultation on your infrastructure requirements.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="whitespace-nowrap h-14 px-8 shadow-xl">
            <Link href="/submit">Start Conversation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}