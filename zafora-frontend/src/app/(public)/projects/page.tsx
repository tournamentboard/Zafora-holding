"use client";
import { useState } from "react";
import { useProjects } from "@/src/modules/public/projects/services/projects.service";
import { useSiteSetting } from "@/src/modules/public/home/services/home.service";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Search, DollarSign, Users, AlertCircle, MapPin, BarChart3, Zap, Droplets, Truck, Stethoscope, Wifi, Leaf } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { motion } from "framer-motion";

import { usePageTitle } from "@/src/hooks/use-page-title";
import { parseSeoSettings } from "@/src/hooks/use-seo-meta";
import ExpressInterestModal from "@/src/modules/public/modals/ExpressInterestModal";

const SECTORS = ["All", "Energy", "Water", "Transport", "Healthcare", "Digital"];
const STATUSES = ["All", "Seeking Funding", "Investor Ready", "Partially Funded", "Funded"];

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Energy:     <Zap className="h-3.5 w-3.5" />,
  Water:      <Droplets className="h-3.5 w-3.5" />,
  Transport:  <Truck className="h-3.5 w-3.5" />,
  Healthcare: <Stethoscope className="h-3.5 w-3.5" />,
  Digital:    <Wifi className="h-3.5 w-3.5" />,
  Agriculture:<Leaf className="h-3.5 w-3.5" />,
  All:        <BarChart3 className="h-3.5 w-3.5" />,
};

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

export default function Projects() {
  const { data: seoData } = useSiteSetting("seo_projects");
  usePageTitle("Project Pipeline", parseSeoSettings(seoData));
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const { data: rawData, isLoading, error } = useProjects({});

  const hasActiveFilters = sector !== "All" || status !== "All" || search !== "";

  // Client-side filtering supports multi-sector (comma-separated in DB)
  const data = {
    ...rawData,
    projects: rawData?.projects?.filter(p => {
      const sectorMatch = sector === "All" || p.sector.split(",").map(s => s.trim()).some(s => s.toLowerCase() === sector.toLowerCase());
      const statusMatch = status === "All" || p.fundingStatus.toLowerCase().replace(/_/g, " ") === status.toLowerCase() || p.fundingStatus === status;
      const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase());
      return sectorMatch && statusMatch && searchMatch;
    }),
  };

  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const formatCurrency = (val: string) => {
    if (!val) return "TBD";
    return val;
  };

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
    <div className="flex flex-col pb-24 bg-[#f7f4ef] min-h-screen">
      {/* Header */}
      <section className="bg-[#173f35] pt-20 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c59b4a]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
            <BarChart3 className="h-3.5 w-3.5" /> Infrastructure Pipeline
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">Project Pipeline</h1>
          <p className="text-xl text-white/65 max-w-2xl leading-relaxed">
            Explore our curated portfolio of transformative infrastructure projects across Africa.
            All projects undergo rigorous Zafora due diligence.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 pt-8 pb-20">
        <div className="bg-white rounded-[36px] p-6 md:p-10 border border-[#e5ded3] shadow-sm">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10 pb-8 border-b border-[#e5ded3]">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {SECTORS.map(s => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border transition-all font-semibold ${
                    sector === s 
                      ? "bg-[#173f35] text-white border-[#173f35] shadow-md" 
                      : "bg-white text-[#65736f] border-[#e5ded3] hover:border-[#173f35]/50 hover:text-[#10231f]"
                  }`}
                  data-testid={`filter-sector-${s}`}
                >
                  {SECTOR_ICONS[s]} {s}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a958f]" />
                <Input 
                  placeholder="Search projects..." 
                  className="pl-10 h-11 bg-[#f7f4ef] border-none rounded-full focus-visible:ring-[#173f35]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-projects"
                />
              </div>
              
              <select 
                className="h-11 bg-white border border-[#e5ded3] text-sm rounded-full px-4 text-[#10231f] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35] w-full sm:w-auto"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                data-testid="select-status"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {error ? (
            <div className="p-10 text-center bg-[#f7dfd9] text-[#b85c4b] rounded-[24px] flex flex-col items-center gap-3 border border-[#b85c4b]/20">
              <AlertCircle className="h-8 w-8" />
              <p className="font-semibold">Failed to load projects. Please try again later.</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[450px] w-full rounded-[24px] bg-[#e5ded3]/50" />)}
            </div>
          ) : data?.projects?.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#e5ded3] rounded-[24px] bg-[#f7f4ef]">
              {hasActiveFilters ? (
                <>
                  <h3 className="text-2xl font-bold text-[#10231f] mb-3">No projects found</h3>
                  <p className="text-[#65736f] mb-6">Try adjusting your filters or search query.</p>
                  <Button variant="outline" className="rounded-full border-[#173f35] text-[#173f35]" onClick={() => { setSector("All"); setStatus("All"); setSearch(""); }}>
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-[#8a958f] opacity-40" />
                  <h3 className="text-2xl font-bold text-[#10231f] mb-3">Pipeline under development</h3>
                  <p className="text-[#65736f] max-w-sm mx-auto">Our project pipeline is being curated. Check back soon for infrastructure opportunities.</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {data?.projects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col bg-white border border-[#e5ded3] rounded-[24px] p-6 hover:border-[#173f35]/30 hover:shadow-[0_12px_34px_rgba(16,35,31,0.06)] transition-all"
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getSectorStyle(project.sector)}`}>
                      {SECTOR_ICONS[project.sector.split(",")[0].trim()] ?? null} {project.sector}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(project.fundingStatus)}`}>
                      {formatStatus(project.fundingStatus)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#10231f] mb-2 leading-snug">{project.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#65736f] mb-4"><MapPin className="h-3.5 w-3.5 shrink-0" />{project.country}</div>
                  
                  <p className="text-sm text-[#65736f] mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                  
                  <div className="bg-[#f7f4ef] rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Est. Value</div>
                        <div className="font-bold text-[#10231f] flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-[#173f35]" />
                          {formatCurrency(project.estimatedValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Zafora Role</div>
                        <div className="font-bold text-[#10231f] truncate" title={project.zaforaRole}>{project.zaforaRole}</div>
                      </div>
                      {project.partnerNeed && (
                        <div className="col-span-2 pt-3 border-t border-[#e5ded3]">
                          <div className="text-xs text-[#8a958f] mb-1 font-semibold uppercase tracking-wider">Partner Needs</div>
                          <div className="font-bold text-[#c59b4a] text-xs uppercase">
                            {project.partnerNeed}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#e5ded3]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8a958f]">
                      <span className="flex -space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#e6eef4] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#385c7a]">I</span>
                        <span className="w-6 h-6 rounded-full bg-[#f6ead2] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#c59b4a]">C</span>
                      </span>
                      {project.interestCount} interests
                    </div>
                    <Button 
                      onClick={() => setSelectedProject(project.id)}
                      size="sm"
                      className="rounded-full bg-[#173f35] text-white hover:bg-[#173f35]/90 font-semibold px-4"
                      data-testid={`btn-express-interest-${project.id}`}
                    >
                      Express Interest
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <ExpressInterestModal 
          projectId={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}
