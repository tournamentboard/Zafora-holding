import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, DollarSign, Users, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ExpressInterestModal from "./ExpressInterestModal";

const SECTORS = ["All", "Energy", "Water", "Transport", "Healthcare", "Digital"];
const STATUSES = ["All", "Seeking Funding", "Investor Ready", "Partially Funded", "Funded"];

export default function Projects() {
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const queryParams: any = {};
  if (sector !== "All") queryParams.sector = sector;
  if (status !== "All") queryParams.status = status;
  if (search) queryParams.search = search;

  const { data, isLoading, error } = useListProjects(queryParams);

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
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-[#10231f] tracking-tight mb-6">Project Pipeline</h1>
          <p className="text-xl text-[#65736f] max-w-2xl leading-relaxed">
            Explore our curated portfolio of transformative infrastructure projects across Africa. 
            All projects undergo rigorous Zafora due diligence.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 pb-20">
        <div className="bg-white rounded-[36px] p-6 md:p-10 border border-[#e5ded3] shadow-sm">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10 pb-8 border-b border-[#e5ded3]">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {SECTORS.map(s => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-4 py-2 text-sm rounded-full border transition-colors font-semibold ${
                    sector === s 
                      ? "bg-[#173f35] text-white border-[#173f35]" 
                      : "bg-white text-[#65736f] border-[#e5ded3] hover:border-[#173f35]/50 hover:text-[#10231f]"
                  }`}
                  data-testid={`filter-sector-${s}`}
                >
                  {s}
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
              <h3 className="text-2xl font-bold text-[#10231f] mb-3">No projects found</h3>
              <p className="text-[#65736f] mb-6">Try adjusting your filters or search query.</p>
              <Button variant="outline" className="rounded-full border-[#173f35] text-[#173f35]" onClick={() => { setSector("All"); setStatus("All"); setSearch(""); }}>
                Clear Filters
              </Button>
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
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a958f] border border-[#e5ded3] px-2 py-1 rounded-md">
                      {project.sector}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(project.fundingStatus)}`}>
                      {formatStatus(project.fundingStatus)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#10231f] mb-2 leading-snug">{project.name}</h3>
                  <div className="text-sm font-medium text-[#65736f] mb-4">{project.country}</div>
                  
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
