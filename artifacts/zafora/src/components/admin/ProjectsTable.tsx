import { useState } from "react";
import { useListProjects, useCreateProject, useDeleteProject, useUpdateProject, useListProjectInterests } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const FUNDING_STATUSES = ["seeking_funding", "investor_ready", "government_review", "partially_funded", "funded", "closed"];

export default function ProjectsTable() {
  const { data, isLoading, refetch } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingInterestsId, setViewingInterestsId] = useState<number | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createProject.mutateAsync({
        // @ts-ignore
        data: {
          name: formData.get("name") as string,
          sector: formData.get("sector") as string,
          country: formData.get("country") as string,
          fundingStatus: formData.get("fundingStatus") as string,
          estimatedValue: formData.get("estimatedValue") as string,
          zaforaRole: formData.get("zaforaRole") as string,
          description: formData.get("description") as string,
        }
      });
      toast({ title: "Project Created" });
      setIsAddOpen(false);
      refetch();
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    const formData = new FormData(e.currentTarget);
    try {
      await updateProject.mutateAsync({
        id: editingProject.id,
        // @ts-ignore
        data: {
          name: formData.get("name") as string,
          sector: formData.get("sector") as string,
          country: formData.get("country") as string,
          fundingStatus: formData.get("fundingStatus") as string,
          estimatedValue: formData.get("estimatedValue") as string,
          zaforaRole: formData.get("zaforaRole") as string,
          description: formData.get("description") as string,
        }
      });
      toast({ title: "Project Updated" });
      setEditingProject(null);
      refetch();
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      // @ts-ignore
      await deleteProject.mutateAsync({ id });
      toast({ title: "Project Deleted" });
      refetch();
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  const ProjectForm = ({ defaultValues, onSubmit, buttonText }: any) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <Input name="name" placeholder="Project Name" defaultValue={defaultValues?.name} required className="bg-background border-border" />
      <div className="grid grid-cols-2 gap-4">
        <select name="sector" defaultValue={defaultValues?.sector || "Energy"} className="border border-border bg-background p-2 rounded-md text-sm">
          <option value="Energy">Energy</option>
          <option value="Water">Water</option>
          <option value="Transport">Transport</option>
          <option value="Healthcare">Healthcare</option>
        </select>
        <Input name="country" placeholder="Country" defaultValue={defaultValues?.country} required className="bg-background border-border" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select name="fundingStatus" defaultValue={defaultValues?.fundingStatus || "seeking_funding"} className="border border-border bg-background p-2 rounded-md text-sm">
          {FUNDING_STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <Input name="estimatedValue" placeholder="Est. Value (e.g. $150M)" defaultValue={defaultValues?.estimatedValue} required className="bg-background border-border" />
      </div>
      <Input name="zaforaRole" placeholder="Zafora Role (e.g. Lead Advisor)" defaultValue={defaultValues?.zaforaRole} required className="bg-background border-border" />
      <Textarea name="description" placeholder="Project Description" defaultValue={defaultValues?.description} className="bg-background border-border" />
      <Button type="submit" className="w-full">{buttonText}</Button>
    </form>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-white">Project Pipeline</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
            <ProjectForm onSubmit={handleCreate} buttonText="Create Project" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data?.projects?.map(project => (
          <div key={project.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-lg text-white mb-1 truncate">{project.name}</h4>
              <div className="text-sm text-muted-foreground flex gap-4 items-center">
                <span className="uppercase text-xs tracking-wider border border-border px-2 py-0.5 rounded">{project.sector}</span>
                <span>{project.country}</span>
                <span className="text-primary font-semibold">{project.estimatedValue}</span>
                <span className="capitalize">{project.fundingStatus.replace("_", " ")}</span>
                <span className="text-primary cursor-pointer hover:underline" onClick={() => setViewingInterestsId(project.id)}>
                  {project.interestCount || 0} interests
                </span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="icon" onClick={() => setViewingInterestsId(project.id)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setEditingProject(project)}>
                <Edit className="w-4 h-4 text-blue-400" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDelete(project.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {!data?.projects?.length && <div className="text-center py-8 text-muted-foreground">No projects found.</div>}
      </div>

      <Dialog open={!!editingProject} onOpenChange={(o) => !o && setEditingProject(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
          {editingProject && <ProjectForm defaultValues={editingProject} onSubmit={handleEdit} buttonText="Save Changes" />}
        </DialogContent>
      </Dialog>

      {viewingInterestsId && <ProjectInterestsModal projectId={viewingInterestsId} onClose={() => setViewingInterestsId(null)} />}
    </div>
  );
}

function ProjectInterestsModal({ projectId, onClose }: { projectId: number, onClose: () => void }) {
  const { data, isLoading } = useListProjectInterests(projectId);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader><DialogTitle>Project Interests</DialogTitle></DialogHeader>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {data?.interests?.length === 0 ? (
              <p className="text-muted-foreground">No interests registered for this project.</p>
            ) : (
              data?.interests?.map(interest => (
                <div key={interest.id} className="p-4 border border-border rounded-lg bg-secondary/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-white">{interest.fullName}</div>
                      <div className="text-sm text-muted-foreground">{interest.organization} • {interest.roleType}</div>
                      <div className="text-xs mt-1">{interest.email} {interest.phone ? `• ${interest.phone}` : ''}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(interest.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  {interest.message && (
                    <div className="mt-3 text-sm text-foreground/80 bg-background/50 p-3 rounded">
                      {interest.message}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}