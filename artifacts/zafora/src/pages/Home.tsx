import { useListProjects, useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Landmark, ShieldCheck, ArrowUpRight, BarChart3, Building, Globe, Zap, Droplets, Truck, Stethoscope, Wheat, Home as HomeIcon, Wifi, GraduationCap, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: projectsData } = useListProjects({ limit: 3 });
  const { data: servicesData } = useListServices();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "funded": return "bg-[#e5f5e9] text-[#173f35] border-[#173f35]/20";
      case "investor_ready": return "bg-[#e6eef4] text-[#385c7a] border-[#385c7a]/20";
      case "partially_funded": return "bg-[#f6ead2] text-[#c59b4a] border-[#c59b4a]/20";
      case "seeking_funding": return "bg-[#f7dfd9] text-[#b85c4b] border-[#b85c4b]/20";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 border border-[#173f35]/20 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-[#173f35] mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#173f35]"></span>
                Government Consulting · Project Development · Global Partnerships
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-[76px] font-bold tracking-[-0.05em] text-[#10231f] leading-[1.05] mb-6"
              >
                Structuring, funding, and delivering high-impact projects.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-[#65736f] mb-10 max-w-xl leading-relaxed font-medium"
              >
                Zafora Holding connects governments, investors, and contractors to develop and deliver critical infrastructure across Africa.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 mb-12"
              >
                <Button asChild size="lg" className="rounded-full bg-[#173f35] hover:bg-[#173f35]/90 text-white h-14 px-8 text-base font-semibold">
                  <Link href="/submit">Partner With Us</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-white border-[#e5ded3] text-[#173f35] hover:bg-[#f7f4ef] h-14 px-8 text-base font-semibold">
                  <Link href="/projects">View Project Pipeline</Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="rounded-full bg-[#c59b4a] hover:bg-[#c59b4a]/90 text-[#10231f] h-14 px-8 text-base font-semibold border-none">
                  <Link href="/services">Explore Consulting Services</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                {["Government-ready documentation", "PPP & funding advisory", "Project lifecycle governance"].map((pill, i) => (
                  <span key={i} className="text-xs font-semibold text-[#173f35] bg-[#173f35]/5 px-3 py-1.5 rounded-full">
                    {pill}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-[#e5ded3]"
              >
                <div>
                  <div className="text-3xl font-bold text-[#10231f] tracking-tight mb-1">360°</div>
                  <div className="text-xs font-semibold text-[#8a958f] uppercase tracking-widest">Project lifecycle</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#10231f] tracking-tight mb-1">Global</div>
                  <div className="text-xs font-semibold text-[#8a958f] uppercase tracking-widest">Africa-first</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#10231f] tracking-tight mb-1">PPP</div>
                  <div className="text-xs font-semibold text-[#8a958f] uppercase tracking-widest">Government + private</div>
                </div>
              </motion.div>
            </div>

            {/* Right - Dark Green Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-[#173f35] to-[#0f2923] rounded-[36px] p-6 lg:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#c59b4a]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="relative z-10 mb-6 h-[250px] rounded-[26px] overflow-hidden flex flex-col justify-end p-6">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                  alt="Executive advisory" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/90 via-[#10231f]/40 to-transparent"></div>
                <h3 className="relative z-10 text-white font-bold text-2xl max-w-sm tracking-tight">
                  Executive advisory for governments, funders, and delivery partners.
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-[20px] p-6 flex flex-col justify-center">
                  <div className="text-sm font-medium text-white/60 mb-2">Pipeline Interest</div>
                  <div className="text-4xl font-bold text-white mb-1 tracking-tight">1,240+</div>
                  <div className="text-sm font-medium text-[#c59b4a]">Partner inquiries</div>
                </div>
                
                <div className="bg-white/5 backdrop-blur border border-white/5 rounded-[20px] p-4 flex flex-col gap-3">
                  {projectsData?.projects?.slice(0, 3).map((project) => (
                    <Link key={project.id} href="/projects" className="group bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 transition-colors flex items-center justify-between">
                      <div className="truncate pr-4">
                        <div className="text-sm font-bold text-white truncate">{project.name}</div>
                        <div className="text-xs text-white/60 truncate">{project.sector} · {project.country}</div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded bg-[#c59b4a]/20 text-[#c59b4a] whitespace-nowrap">
                        {formatStatus(project.fundingStatus)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Band Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px] md:h-[500px] rounded-[30px] overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1400&q=80" 
                alt="Government" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/80 via-[#10231f]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">A credible digital front door for government work.</h3>
              </div>
            </div>
            <div className="h-[400px] md:h-[500px] rounded-[30px] overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80" 
                alt="Execution" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10231f]/80 via-[#10231f]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">From opportunity to execution.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for governments section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">Built for ecosystem leaders</h2>
            <p className="text-xl text-[#65736f] max-w-2xl mx-auto">Zafora connects the three critical pillars of infrastructure development.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Governments", desc: "Originate projects, structure concessions, and access global capital without overburdening sovereign debt.", icon: <Landmark className="w-8 h-8 text-[#173f35]" /> },
              { title: "Investors & DFIs", desc: "Access a curated pipeline of derisked, ESG-compliant infrastructure assets with clear yield parameters.", icon: <BarChart3 className="w-8 h-8 text-[#173f35]" /> },
              { title: "Contractors & EPC", desc: "Discover bankable projects ready for execution, and partner with reputable global sponsors.", icon: <Building className="w-8 h-8 text-[#173f35]" /> }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[30px] p-8 border border-[#e5ded3] shadow-[0_12px_34px_rgba(16,35,31,0.04)]">
                <div className="w-16 h-16 rounded-[16px] bg-[#efe3cf] flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#10231f] mb-3">{card.title}</h3>
                <p className="text-[#65736f] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#ffffff] border-y border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">Advisory & Services</h2>
              <p className="text-xl text-[#65736f]">End-to-end structuring, funding, and delivery solutions.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/services">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesData?.services?.slice(0, 3).map((service, i) => (
              <div key={service.id} className="bg-white border border-[#e5ded3] p-8 rounded-[22px] shadow-[0_12px_34px_rgba(16,35,31,0.06)] hover:border-[#173f35]/30 transition-colors">
                <div className="w-14 h-14 bg-[#f7f4ef] rounded-[14px] flex items-center justify-center mb-6 text-[#173f35]">
                  {i === 0 ? <Landmark className="w-7 h-7" /> : i === 1 ? <Briefcase className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                </div>
                <h3 className="text-xl font-bold text-[#10231f] mb-4">{service.name}</h3>
                <p className="text-[#65736f] mb-6 min-h-[80px]">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.bullets?.slice(0, 3).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#10231f] font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#c59b4a] shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/submit?service=${encodeURIComponent(service.name)}`} className="text-[#173f35] font-bold text-sm inline-flex items-center hover:underline">
                  Engage Practice <ArrowUpRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / Delivery Model */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-[#173f35] rounded-[40px] p-10 md:p-16 lg:p-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80')] opacity-5 mix-blend-overlay object-cover"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">The Delivery Model</h2>
              <p className="text-xl text-white/70 max-w-2xl mb-16">Our proprietary methodology derisks projects at every stage.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {[
                  { num: "01", title: "Origination & Screening", desc: "Identifying viable national projects and conducting preliminary technical and economic viability assessments." },
                  { num: "02", title: "Feasibility & Structuring", desc: "Developing bankable legal entities, ensuring ESG compliance, and establishing strong governance frameworks." },
                  { num: "03", title: "Capital Raising", desc: "Connecting projects with our global network of DFIs, sovereign wealth funds, and private equity." },
                  { num: "04", title: "Procurement", desc: "Transparent, competitive tendering to select world-class EPC contractors and technology partners." },
                  { num: "05", title: "Execution Oversight", desc: "Stringent project management, milestone tracking, and quality assurance during construction." },
                  { num: "06", title: "Operations & Handover", desc: "Ensuring smooth transition to operational phase with trained local personnel and O&M contracts." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="text-2xl font-bold text-[#c59b4a] shrink-0">{step.num}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Pipeline Preview */}
      <section className="py-24 bg-[#f7f4ef]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">Project Pipeline</h2>
              <p className="text-xl text-[#65736f]">High-impact infrastructure assets currently seeking partners.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full bg-white border-[#e5ded3] text-[#10231f] hover:bg-white/60">
              <Link href="/projects">View Entire Portfolio</Link>
            </Button>
          </div>

          <div className="bg-white rounded-[36px] p-8 border border-[#e5ded3] shadow-sm">
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-4 py-1.5 rounded-full border border-[#173f35] bg-[#173f35] text-white text-sm font-semibold">All Projects</span>
              <span className="px-4 py-1.5 rounded-full border border-[#e5ded3] bg-white text-[#65736f] text-sm font-semibold hover:border-[#173f35]/50">Seeking Funding</span>
              <span className="px-4 py-1.5 rounded-full border border-[#e5ded3] bg-white text-[#65736f] text-sm font-semibold hover:border-[#173f35]/50">Investor Ready</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projectsData?.projects?.slice(0, 3).map((project) => (
                <div key={project.id} className="bg-white border border-[#e5ded3] rounded-[24px] p-6 flex flex-col hover:border-[#173f35]/30 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                  <div className="flex justify-between items-start mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a958f] border border-[#e5ded3] px-2 py-1 rounded-md">
                      {project.sector}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(project.fundingStatus)}`}>
                      {formatStatus(project.fundingStatus)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#10231f] mb-2 leading-snug">{project.name}</h3>
                  <div className="text-sm font-medium text-[#65736f] mb-4">{project.country}</div>
                  
                  <div className="bg-[#f7f4ef] rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Est. Value</div>
                        <div className="font-bold text-[#10231f]">{project.estimatedValue || "TBD"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Zafora Role</div>
                        <div className="font-bold text-[#10231f] truncate">{project.zaforaRole}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#e5ded3]">
                    <div className="text-xs font-semibold text-[#8a958f] flex items-center gap-1.5">
                      <span className="flex -space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#e6eef4] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#385c7a]">I</span>
                        <span className="w-6 h-6 rounded-full bg-[#f6ead2] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#c59b4a]">C</span>
                      </span>
                      {project.interestCount} interests
                    </div>
                    <Button asChild size="sm" className="rounded-full bg-[#173f35] text-white hover:bg-[#173f35]/90">
                      <Link href="/projects">Express Interest</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Engagement Paths */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[30px] overflow-hidden border border-[#e5ded3] shadow-sm flex flex-col">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80" alt="Submit" className="w-full h-[190px] object-cover" />
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[#10231f] mb-3">Submit a Project</h3>
                <p className="text-[#65736f] mb-8 flex-1">Sovereign entities and developers can submit infrastructure concepts for evaluation and structuring.</p>
                <Button asChild className="w-full rounded-full bg-[#173f35] text-white font-semibold">
                  <Link href="/submit">Start Submission</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-[30px] overflow-hidden border border-[#e5ded3] shadow-sm flex flex-col">
              <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80" alt="Invest" className="w-full h-[190px] object-cover" />
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[#10231f] mb-3">Invest & Fund</h3>
                <p className="text-[#65736f] mb-8 flex-1">DFIs, private equity, and institutional investors can access our pipeline of bankable assets.</p>
                <Button asChild variant="outline" className="w-full rounded-full border-[#173f35] text-[#173f35] font-semibold">
                  <Link href="/projects">View Pipeline</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-[30px] overflow-hidden border border-[#e5ded3] shadow-sm flex flex-col">
              <img src="https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=600&q=80" alt="Partner" className="w-full h-[190px] object-cover" />
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[#10231f] mb-3">Execution Partners</h3>
                <p className="text-[#65736f] mb-8 flex-1">EPC contractors and operators can bid on structured projects and form delivery consortia.</p>
                <Button asChild variant="outline" className="w-full rounded-full border-[#e5ded3] text-[#10231f] font-semibold">
                  <Link href="/submit">Register Interest</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-24 bg-white border-y border-[#e5ded3]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-4">Core Sectors</h2>
            <p className="text-xl text-[#65736f] max-w-2xl mx-auto">We focus on critical infrastructure that drives economic growth.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Energy & Power", icon: <Zap className="w-6 h-6" /> },
              { name: "Water & Sanitation", icon: <Droplets className="w-6 h-6" /> },
              { name: "Transportation", icon: <Truck className="w-6 h-6" /> },
              { name: "Healthcare", icon: <Stethoscope className="w-6 h-6" /> },
              { name: "Agriculture", icon: <Wheat className="w-6 h-6" /> },
              { name: "Housing", icon: <HomeIcon className="w-6 h-6" /> },
              { name: "Digital Infra", icon: <Wifi className="w-6 h-6" /> },
              { name: "Education", icon: <GraduationCap className="w-6 h-6" /> }
            ].map((sector, i) => (
              <div key={i} className="bg-[#f7f4ef] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#efe3cf] transition-colors cursor-pointer group">
                <div className="text-[#c59b4a] font-bold text-lg mb-3">0{i+1}</div>
                <div className="text-[#10231f] group-hover:text-[#173f35] mb-2">{sector.icon}</div>
                <h4 className="font-bold text-[#10231f]">{sector.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Why Zafora */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="bg-gradient-to-br from-[#f7f4ef] to-[#efe3cf] rounded-[36px] p-10 md:p-16 h-full flex flex-col justify-center border border-[#e5ded3]">
              <h2 className="text-4xl md:text-5xl font-bold text-[#10231f] tracking-tight mb-6">About Zafora Holding</h2>
              <p className="text-lg text-[#10231f] font-medium mb-6 leading-relaxed">
                We are a specialized advisory and development firm dedicated exclusively to African infrastructure. 
              </p>
              <p className="text-[#65736f] leading-relaxed mb-8">
                Our team comprises veterans from global finance, engineering, and government who understand the unique complexities of delivering mega-projects in emerging markets. We bridge the gap between local realities and international capital requirements.
              </p>
              <div className="mt-auto">
                <Button asChild variant="link" className="text-[#173f35] font-bold p-0 h-auto text-base hover:no-underline">
                  <Link href="/services" className="flex items-center">
                    Discover our methodology <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Structured Methodology", desc: "Every project follows a strict framework to ensure bankability and mitigate execution risks.", icon: <ShieldCheck className="text-[#c59b4a] w-6 h-6" /> },
                { title: "Compliance-Aware", desc: "Deep integration of ESG standards and legal compliance required by tier-1 global investors.", icon: <FileCheck className="text-[#c59b4a] w-6 h-6" /> },
                { title: "Partner-Driven", desc: "We act as the central node, aligning the interests of state sponsors, financiers, and contractors.", icon: <Users className="text-[#c59b4a] w-6 h-6" /> }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-[24px] p-8 border border-[#e5ded3] flex gap-5 shadow-sm">
                  <div className="bg-[#f6ead2] w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#10231f] mb-2">{item.title}</h4>
                    <p className="text-[#65736f] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#173f35] to-[#245d4e] rounded-[40px] p-10 md:p-16 lg:p-20 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Start the conversation</h2>
                <p className="text-xl text-white/80 max-w-lg">
                  Submit a project, request our advisory capabilities, or explore investment opportunities.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Button asChild size="lg" className="rounded-full bg-white text-[#173f35] hover:bg-gray-100 h-14 px-8 text-base font-bold">
                  <Link href="/submit">Email Zafora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base font-bold bg-transparent">
                  <Link href="/submit?type=project_submission">Submit Project</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Ensure these imports are available in the scope
import { FileCheck, Users } from "lucide-react";
