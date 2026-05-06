import { useState } from "react";
import { useListDocuments, useCreateDocument, useDeleteDocument } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, FileIcon } from "lucide-react";
import { format } from "date-fns";

export default function DocumentsTable() {
  const { data, isLoading, refetch } = useListDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createDoc.mutateAsync({
        // @ts-ignore
        data: {
          title: formData.get("title") as string,
          documentType: formData.get("documentType") as string,
          visibility: formData.get("visibility") as string,
          fileUrl: formData.get("fileUrl") as string,
        }
      });
      toast({ title: "Document added" });
      setIsOpen(false);
      refetch();
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this document?")) return;
    try {
      // @ts-ignore
      await deleteDoc.mutateAsync({ id });
      toast({ title: "Document deleted" });
      refetch();
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-white">Document Center</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Document</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Add Document Reference</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <Input name="title" placeholder="Document Title" required className="bg-background" />
              <select name="documentType" className="w-full border-border bg-background p-2 rounded-md text-sm">
                <option value="capability_statement">Capability Statement</option>
                <option value="case_study">Case Study</option>
                <option value="compliance">Compliance</option>
                <option value="teaser">Project Teaser</option>
              </select>
              <select name="visibility" className="w-full border-border bg-background p-2 rounded-md text-sm">
                <option value="public">Public</option>
                <option value="government_only">Government Only</option>
                <option value="investor_only">Investor Only</option>
                <option value="admin_only">Admin Only</option>
              </select>
              <Input name="fileUrl" placeholder="File URL (e.g. S3 link)" className="bg-background" />
              <Button type="submit" className="w-full">Save Document</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="p-4 font-semibold text-muted-foreground w-12"></th>
              <th className="p-4 font-semibold text-muted-foreground">Title</th>
              <th className="p-4 font-semibold text-muted-foreground">Type</th>
              <th className="p-4 font-semibold text-muted-foreground">Visibility</th>
              <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.documents?.map(doc => (
              <tr key={doc.id} className="hover:bg-secondary/20 transition-colors">
                <td className="p-4 text-primary"><FileIcon className="h-5 w-5" /></td>
                <td className="p-4 font-medium text-white">{doc.title}</td>
                <td className="p-4 uppercase text-xs tracking-wider">{doc.documentType.replace("_", " ")}</td>
                <td className="p-4">
                  <span className="bg-secondary px-2 py-1 rounded text-xs">{doc.visibility.replace("_", " ")}</span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {!data?.documents?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No documents uploaded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}