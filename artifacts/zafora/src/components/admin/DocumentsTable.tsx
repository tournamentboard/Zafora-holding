import { useState } from "react";
import { useListDocuments, useCreateDocument, useDeleteDocument } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, X, FileText, Lock, Globe, Users, Building2 } from "lucide-react";
import { format } from "date-fns";

const DOC_TYPES = [
  { value: "capability_statement", label: "Capability Statement" },
  { value: "case_study", label: "Case Study" },
  { value: "compliance", label: "Compliance Document" },
  { value: "teaser", label: "Project Teaser" },
];

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Everyone can see it", icon: <Globe className="h-4 w-4" />, color: "bg-green-100 text-green-700" },
  { value: "government_only", label: "Government officials only", icon: <Building2 className="h-4 w-4" />, color: "bg-blue-100 text-blue-700" },
  { value: "investor_only", label: "Investors only", icon: <Users className="h-4 w-4" />, color: "bg-purple-100 text-purple-700" },
  { value: "admin_only", label: "Only you (admin)", icon: <Lock className="h-4 w-4" />, color: "bg-gray-100 text-gray-600" },
];

function getDocType(value: string) {
  return DOC_TYPES.find(d => d.value === value)?.label || value;
}

function getVisibility(value: string) {
  return VISIBILITY_OPTIONS.find(v => v.value === value) || { label: value, icon: <Globe className="h-4 w-4" />, color: "bg-gray-100 text-gray-600" };
}

export default function DocumentsTable() {
  const { data, isLoading, refetch } = useListDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

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
          fileUrl: (formData.get("fileUrl") as string) || undefined,
        }
      });
      toast({ title: "Document added!" });
      setShowForm(false);
      refetch();
      (e.target as HTMLFormElement).reset();
    } catch {
      toast({ title: "Could not add document. Try again.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Remove "${title}"? This cannot be undone.`)) return;
    try {
      // @ts-ignore
      await deleteDoc.mutateAsync({ id });
      toast({ title: "Document removed." });
      refetch();
    } catch {
      toast({ title: "Could not remove. Try again.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-[#e5ded3]" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#10231f] mb-1">Documents</h2>
          <p className="text-[#65736f]">Add links to your documents (capability statements, case studies, etc.) here.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors shrink-0"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Document"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border-2 border-[#173f35] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#10231f] mb-5">Add a Document</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Document Title *</label>
              <input name="title" required placeholder="e.g. Zafora Capability Statement 2025"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-1.5">What type of document is this?</label>
                <select name="documentType"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]">
                  {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Who can see this?</label>
                <select name="visibility"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]">
                  {VISIBILITY_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-1.5">File URL (optional)</label>
              <input name="fileUrl" placeholder="Paste the link to your file (e.g. Google Drive, Dropbox link)"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
              <p className="text-xs text-[#8a958f] mt-1">You can add this later too.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors">
                Save Document
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-[#e5ded3] text-[#65736f] font-semibold hover:bg-[#f7f4ef] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document list */}
      <div className="space-y-3">
        {!data?.documents?.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e5ded3]">
            <FileText className="h-10 w-10 mx-auto mb-3 text-[#8a958f] opacity-30" />
            <p className="text-[#65736f] font-medium">No documents yet.</p>
            <p className="text-[#8a958f] text-sm mt-1">Click "Add Document" to add your first document.</p>
          </div>
        ) : (
          data.documents.map(doc => {
            const visInfo = getVisibility(doc.visibility);
            return (
              <div key={doc.id} className="bg-white border border-[#e5ded3] rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#efe3cf] flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-[#c59b4a]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#10231f] mb-1">{doc.title}</div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="bg-[#f7f4ef] text-[#65736f] font-medium px-2.5 py-1 rounded-lg">
                      {getDocType(doc.documentType)}
                    </span>
                    <span className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg ${visInfo.color}`}>
                      {visInfo.icon} {visInfo.label}
                    </span>
                    {doc.createdAt && (
                      <span className="text-[#8a958f]">Added {format(new Date(doc.createdAt), "MMM d, yyyy")}</span>
                    )}
                  </div>
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-[#173f35] hover:underline font-medium mt-1 inline-block truncate max-w-xs">
                      View file
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(doc.id, doc.title)}
                  className="p-3 rounded-xl border border-[#e5ded3] text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
                  title="Remove this document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Tip */}
      <div className="bg-[#f7f4ef] border border-[#e5ded3] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#10231f] mb-1">Tip: Where to host your files</p>
        <p className="text-sm text-[#65736f]">
          Upload your PDF files to Google Drive, Dropbox, or OneDrive, then paste the shareable link here.
          Set the file to "Anyone with the link can view" before adding the URL.
        </p>
      </div>
    </div>
  );
}
