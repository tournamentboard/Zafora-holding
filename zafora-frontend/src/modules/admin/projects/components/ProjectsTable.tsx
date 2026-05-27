"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/src/modules/admin/projects";
import type { Project } from "@/src/lib/types";
import InterestsModal from "@/src/modules/admin/modals/InterestsModal";
import { Plus, Pencil, Trash2, X, MapPin, DollarSign, Eye, ChevronDown, ChevronUp, Users } from "lucide-react";
import { PhotoUploadField } from "@/src/modules/admin/shared/components/PhotoUploadField";
import { STORAGE_FOLDER } from "@/src/lib/constants";

const SECTORS = ["Energy","Water","Transport","Healthcare","Agriculture","Housing","Digital","Education","Logistics","Telecom"];
const FUNDING_STATUSES = [
  { value: "seeking_funding",   label: "Seeking Funding",   color: "bg-red-100 text-red-600" },
  { value: "investor_ready",    label: "Investor Ready",    color: "bg-blue-100 text-blue-700" },
  { value: "government_review", label: "Government Review", color: "bg-purple-100 text-purple-700" },
  { value: "partially_funded",  label: "Partially Funded",  color: "bg-yellow-100 text-yellow-700" },
  { value: "funded",            label: "Funded",            color: "bg-green-100 text-green-700" },
  { value: "closed",            label: "Closed",            color: "bg-gray-100 text-gray-600" },
];
const SECTOR_COLORS: Record<string, string> = {
  Energy: "bg-yellow-100 text-yellow-700", Water: "bg-blue-100 text-blue-700",
  Transport: "bg-purple-100 text-purple-700", Healthcare: "bg-red-100 text-red-600",
  Agriculture: "bg-green-100 text-green-700", Housing: "bg-orange-100 text-orange-700",
  Digital: "bg-teal-100 text-teal-700", Education: "bg-indigo-100 text-indigo-700",
  Logistics: "bg-cyan-100 text-cyan-700", Telecom: "bg-pink-100 text-pink-700",
};

function getFundingInfo(value: string) {
  return FUNDING_STATUSES.find((s) => s.value === value) ?? { label: value, color: "bg-gray-100 text-gray-600" };
}
function parseSectors(sector: string): string[] {
  return sector ? sector.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function SectorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = parseSectors(value);
  const toggle = (sector: string) => {
    const next = selected.includes(sector) ? selected.filter((s) => s !== sector) : [...selected, sector];
    onChange(next.join(","));
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {SECTORS.map((sector) => {
          const isSelected = selected.includes(sector);
          return (
            <button key={sector} type="button" onClick={() => toggle(sector)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isSelected ? "bg-[#173f35] text-white border-[#173f35] shadow-sm" : "bg-white text-[#65736f] border-[#e5ded3] hover:border-[#173f35] hover:text-[#173f35]"}`}>
              {sector}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && <p className="text-xs text-amber-600 font-medium">Select at least one sector.</p>}
    </div>
  );
}

function ProjectForm({ defaultValues, onSubmit, buttonText, onCancel }: {
  defaultValues?: Project | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, sectors: string, imageUrl: string) => void;
  buttonText: string;
  onCancel?: () => void;
}) {
  const [sectors, setSectors] = useState((defaultValues?.sector as string) ?? "");
  const [imageUrl, setImageUrl] = useState((defaultValues?.imageUrl as string) ?? "");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sectors) { alert("Please select at least one sector."); return; }
    onSubmit(e, sectors, imageUrl);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Project Name *</label>
        <input name="name" defaultValue={defaultValues?.name as string} required placeholder="e.g. Lagos Water Treatment Plant"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-2">Sectors * <span className="text-xs font-normal text-[#8a958f]">(select all that apply)</span></label>
        <div className="bg-[#f7f4ef] border border-[#e5ded3] rounded-xl p-4">
          <SectorPicker value={sectors} onChange={setSectors} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Country *</label>
          <input name="country" defaultValue={defaultValues?.country as string} required placeholder="e.g. Nigeria"
            className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Region</label>
          <input name="region" defaultValue={defaultValues?.region as string} placeholder="e.g. West Africa"
            className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Funding Status *</label>
          <div className="relative">
            <select name="fundingStatus" defaultValue={(defaultValues?.fundingStatus as string) ?? "seeking_funding"}
              className="w-full appearance-none border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-8">
              {FUNDING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a958f] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Estimated Value *</label>
          <input name="estimatedValue" defaultValue={defaultValues?.estimatedValue as string} required placeholder="e.g. $50M"
            className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Zafora's Role *</label>
        <input name="zaforaRole" defaultValue={defaultValues?.zaforaRole as string} required placeholder="e.g. Lead Advisor"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Partner Needs</label>
        <input name="partnerNeed" defaultValue={defaultValues?.partnerNeed as string} placeholder="e.g. Investors, EPC Contractors"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Description</label>
        <textarea name="description" defaultValue={defaultValues?.description as string} rows={4} placeholder="A brief description..."
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] resize-none" />
      </div>
      <div>
        <PhotoUploadField
          folder={STORAGE_FOLDER.PROJECTS_IMAGES}
          label="Image (optional)"
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="https://..."
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="submit" className="flex-1 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors">{buttonText}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-[#e5ded3] text-[#65736f] font-semibold hover:bg-[#f7f4ef] transition-colors">Cancel</button>
        )}
      </div>
    </form>
  );
}

export default function ProjectsTable() {
  const { data, isLoading } = useAdminProjects();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingInterestsId, setViewingInterestsId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>, sectors: string, imageUrl: string) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createProject({
        name: fd.get("name") as string,
        sector: sectors,
        country: fd.get("country") as string,
        region: (fd.get("region") as string) || undefined,
        fundingStatus: fd.get("fundingStatus") as string,
        estimatedValue: fd.get("estimatedValue") as string,
        zaforaRole: fd.get("zaforaRole") as string,
        partnerNeed: (fd.get("partnerNeed") as string) || undefined,
        description: (fd.get("description") as string) || undefined,
        imageUrl: imageUrl || undefined,
      });
      toast.success("Project added!");
      setShowAddForm(false);
    } catch {
      toast.error("Could not add project. Try again.");
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, sectors: string, imageUrl: string) => {
    e.preventDefault();
    if (!editingProject) return;
    const fd = new FormData(e.currentTarget);
    try {
      await updateProject({
        id: editingProject.id,
        data: {
          name: fd.get("name") as string,
          sector: sectors,
          country: fd.get("country") as string,
          region: (fd.get("region") as string) || undefined,
          fundingStatus: fd.get("fundingStatus") as string,
          estimatedValue: fd.get("estimatedValue") as string,
          zaforaRole: fd.get("zaforaRole") as string,
          partnerNeed: (fd.get("partnerNeed") as string) || undefined,
          description: (fd.get("description") as string) || undefined,
          imageUrl: imageUrl || undefined,
        },
      });
      toast.success("Project updated!");
      setEditingProject(null);
    } catch {
      toast.error("Could not update project. Try again.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Remove "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      toast.success("Project removed.");
    } catch {
      toast.error("Could not delete. Try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white rounded-2xl border border-[#e5ded3]" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#10231f] mb-1">Projects</h2>
          <p className="text-[#65736f]">These are the projects shown on your website.</p>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setEditingProject(null); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors shrink-0">
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add New Project"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border-2 border-[#173f35] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#10231f] mb-5">Add a New Project</h3>
          <ProjectForm onSubmit={handleCreate} buttonText="Add to Website" onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {data?.projects?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e5ded3]">
            <p className="text-[#65736f] font-medium">No projects yet.</p>
          </div>
        )}
        {data?.projects?.map((project) => {
          const fundingInfo = getFundingInfo(project.fundingStatus);
          const sectorList = parseSectors(project.sector);
          const isEditing = editingProject?.id === project.id;
          const isExpanded = expandedId === project.id;

          return (
            <div key={project.id} className="bg-white border border-[#e5ded3] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {sectorList.map((s) => (
                        <span key={s} className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${SECTOR_COLORS[s] ?? "bg-gray-100 text-gray-600"}`}>{s}</span>
                      ))}
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${fundingInfo.color}`}>{fundingInfo.label}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#10231f] mb-2">{project.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#65736f]">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.country}{project.region ? ` · ${project.region}` : ""}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{project.estimatedValue}</span>
                      <button onClick={() => setViewingInterestsId(project.id)} className="flex items-center gap-1 text-[#173f35] font-semibold hover:underline">
                        <Users className="h-3.5 w-3.5" />{project.interestCount ?? 0} interested
                      </button>
                    </div>
                    {project.description && (
                      <button onClick={() => setExpandedId(isExpanded ? null : project.id)}
                        className="flex items-center gap-1 mt-2 text-xs text-[#8a958f] hover:text-[#173f35] transition-colors">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        {isExpanded ? "Hide description" : "Show description"}
                      </button>
                    )}
                    {isExpanded && project.description && (
                      <p className="mt-2 text-sm text-[#65736f] leading-relaxed bg-[#f7f4ef] rounded-xl px-4 py-3">{project.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setViewingInterestsId(project.id)} className="p-2.5 rounded-xl border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef] transition-colors"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setEditingProject(isEditing ? null : project)} className={`p-2.5 rounded-xl border transition-colors ${isEditing ? "bg-[#173f35] text-white border-[#173f35]" : "border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef]"}`}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(project.id, project.name)} className="p-2.5 rounded-xl border border-[#e5ded3] text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="border-t border-[#e5ded3] p-5 bg-[#f7f4ef]">
                  <h4 className="font-bold text-[#10231f] mb-4">Edit this project</h4>
                  <ProjectForm defaultValues={editingProject} onSubmit={handleEdit} buttonText="Save Changes" onCancel={() => setEditingProject(null)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {viewingInterestsId && (
        <InterestsModal projectId={viewingInterestsId} onClose={() => setViewingInterestsId(null)} />
      )}
    </div>
  );
}
