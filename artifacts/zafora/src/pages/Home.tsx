import { useListProjects, useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";
import { ArrowRight, Briefcase, Landmark, ShieldCheck } from "lucide-react";

export default function Home() {
  const { data: projectsData } = useListProjects({ limit: 3 });
  const { data: servicesData } = useListServices();

  const trustBadges = [
    "World Bank Group",
    "African Development Bank",
    "United Nations Development Programme",
    "International Finance Corporation"
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="African Infrastructure" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-block border border-primary/30 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
                Elite Infrastructure Advisory
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Building Africa's <br/>
              <span className="text-primary">Infrastructure</span> Future.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              Zafora Holding connects governments, investors, and contractors to develop and deliver critical infrastructure projects across the continent.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/20">
                <Link href="/projects">View Pipeline</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold border-primary/50 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                <Link href="/submit">Request Consultation</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Aligning with global standards and institutions
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {trustBadges.map((badge, i) => (
              <div key={i} className="text-lg md:text-xl font-serif font-bold text-white">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basic Stats Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col gap-2 py-8 md:py-0">
              <span className="text-5xl md:text-6xl font-serif font-bold text-white">$4.2B<span className="text-primary">+</span></span>
              <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Funding Secured</span>
            </div>
            <div className="flex flex-col gap-2 py-8 md:py-0">
              <span className="text-5xl md:text-6xl font-serif font-bold text-white">14</span>
              <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Countries Active</span>
            </div>
            <div className="flex flex-col gap-2 py-8 md:py-0">
              <span className="text-5xl md:text-6xl font-serif font-bold text-white">35<span className="text-primary">+</span></span>
              <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Active Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif font-bold text-white mb-4">Comprehensive Advisory</h2>
              <p className="text-lg text-muted-foreground">
                We provide end-to-end structuring, funding, and delivery solutions for sovereign and private infrastructure assets.
              </p>
            </div>
            <Button asChild variant="link" className="text-primary hover:text-primary/80">
              <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesData?.services?.slice(0, 3).map((service, i) => (
              <div key={service.id} className="bg-card border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {i === 0 ? <Landmark /> : i === 1 ? <Briefcase /> : <ShieldCheck />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.name}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-3">{service.description}</p>
                <Link href="/services" className="text-sm font-semibold text-primary inline-flex items-center hover:underline">
                  Learn more <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Evaluation */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white mb-6">The Zafora Framework</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our proprietary evaluation and structuring methodology ensures every project we touch is derisked and investor-ready.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Origination & Feasibility", desc: "Identifying viable national projects and conducting preliminary technical and economic viability assessments." },
                  { title: "Structuring & Compliance", desc: "Creating bankable legal entities, ensuring ESG compliance, and establishing strong governance." },
                  { title: "Capital Raising", desc: "Connecting projects with our global network of DFIs, sovereign wealth funds, and private equity." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-primary text-primary flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border p-8 md:p-12 rounded-2xl relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-2xl rounded-full"></div>
              <h3 className="text-2xl font-serif font-bold text-white mb-6">Government Portal</h3>
              <p className="text-muted-foreground mb-8">
                Sovereign entities can submit infrastructure pipelines for direct evaluation by our advisory team. We provide rapid feedback on bankability and funding readiness.
              </p>
              <Button asChild size="lg" className="w-full font-bold">
                <Link href="/government">Enter Government Review Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-serif font-bold text-white mb-4">Featured Pipeline</h2>
              <p className="text-lg text-muted-foreground">
                High-impact infrastructure assets currently in our development and funding pipeline.
              </p>
            </div>
            <Button asChild variant="outline" className="border-border">
              <Link href="/projects">View Entire Portfolio</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsData?.projects?.slice(0, 3).map((project) => (
              <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded">
                      {project.sector}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded font-semibold">
                      {project.fundingStatus.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                  <div className="text-sm text-muted-foreground mb-4">{project.country}</div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground uppercase mb-1">Est. Value</div>
                    <div className="font-semibold text-white">{project.estimatedValue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('@/assets/hero-bg.png')] opacity-10 mix-blend-multiply bg-cover bg-center"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">Partner With Zafora Holding</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Submit your infrastructure project, request our advisory capabilities, or explore investment opportunities in our pipeline.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-2xl">
            <Link href="/submit">Initiate Contact</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}