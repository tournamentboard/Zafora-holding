import { useState } from "react";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, DollarSign, Users, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ExpressInterestModal from "./ExpressInterestModal";

const SECTORS = ["All", "Energy", "Water", "Transport", "Healthcare"];
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
      case "funded": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "investor_ready": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "partially_funded": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <section className="bg-secondary py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Project Pipeline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our curated portfolio of transformative infrastructure projects across Africa. 
            All projects undergo rigorous Zafora due diligence.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card sticky top-20 z-40">
        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 w-full md:hidden">Sector</div>
            {SECTORS.map(s => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  sector === s 
                    ? "bg-primary text-primary-foreground border-primary font-semibold" 
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                }`}
                data-testid={`filter-sector-${s}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-background border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-projects"
              />
            </div>
            
            <select 
              className="bg-background border border-border text-sm rounded-md px-3 py-2 text-foreground"
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
      </section>

      {/* Grid */}
      <section className="py-12 container mx-auto px-4 md:px-8">
        {error ? (
          <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8" />
            <p>Failed to load projects. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-xl" />)}
          </div>
        ) : data?.projects?.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSector("All"); setStatus("All"); setSearch(""); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.projects?.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors shadow-sm"
                data-testid={`card-project-${project.id}`}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-secondary text-foreground border-border uppercase tracking-widest text-[10px]">
                      {project.sector}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(project.fundingStatus)}>
                      {formatStatus(project.fundingStatus)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-white mb-2 line-clamp-2">{project.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{project.region ? `${project.region}, ` : ''}{project.country}</span>
                  </div>
                  
                  <p className="text-sm text-foreground/80 mb-6 line-clamp-3 flex-1">
                    {project.description || "No description provided."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4 border-t border-border/50 text-sm mt-auto mb-6">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Est. Value</div>
                      <div className="font-semibold text-white flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" />
                        {formatCurrency(project.estimatedValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Zafora Role</div>
                      <div className="font-medium text-white truncate" title={project.zaforaRole}>{project.zaforaRole}</div>
                    </div>
                    {project.partnerNeed && (
                      <div className="col-span-2">
                        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Partner Needs</div>
                        <div className="font-medium text-primary bg-primary/10 px-2 py-1 rounded inline-block">
                          {project.partnerNeed}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{project.interestCount} interests</span>
                    </div>
                    <Button 
                      onClick={() => setSelectedProject(project.id)}
                      className="w-full font-semibold"
                      data-testid={`btn-express-interest-${project.id}`}
                    >
                      Express Interest
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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