import { useState } from "react";
import { useListDocuments, useCreateDocument, useDeleteDocument, useUpdateDocument } from "@/src/lib/api-client-react";
import { useToast } from "@/src/hooks/use-toast";
import PreviewModal from "@/src/modules/admin/modals/PreviewModal";
import {
  DOC_TYPES,
  VISIBILITY_OPTIONS,
  getDocType,
  getVisibility,
  getPreviewUrl,
} from "@/src/modules/admin/documents/constants";
import {
  Plus, Trash2, X, FileText, Lock, Globe, Users, Building2,
  Eye, Pencil, ExternalLink, Download, ChevronDown, FileCheck,
  BookOpen, Info
} from "lucide-react";
import { format } from "date-fns";

// ── Document Form ──────────────────────────────────────────────────
function DocumentForm({ defaultValues, onSubmit, buttonText, onCancel }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Document Title *</label>
        <input name="title" required defaultValue={defaultValues?.title} placeholder="e.g. Zafora Capability Statement 2025"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Description / Notes <span className="text-xs font-normal text-[#8a958f]">(internal)</span></label>
        <textarea name="description" defaultValue={defaultValues?.description} rows={2} placeholder="What is this document for? Who should receive it?"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Document Type</label>
          <div className="relative">
            <select name="documentType" defaultValue={defaultValues?.documentType || "capability_statement"}
              className="w-full appearance-none border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-8">
              {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a958f] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Who Can See This?</label>
          <div className="relative">
            <select name="visibility" defaultValue={defaultValues?.visibility || "public"}
              className="w-full appearance-none border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-8">
              {VISIBILITY_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a958f] pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#10231f] mb-1.5">File URL</label>
        <input name="fileUrl" defaultValue={defaultValues?.fileUrl} placeholder="Paste Google Drive, Dropbox, OneDrive, or direct PDF link"
          className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
        <p className="text-xs text-[#8a958f] mt-1.5 leading-relaxed">
          Paste a link from Google Drive, Dropbox, or OneDrive. Make sure the file is set to "Anyone with the link can view." Direct PDF URLs are also supported.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <button type="submit" className="flex-1 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors">
          {buttonText}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl border border-[#e5ded3] text-[#65736f] font-semibold hover:bg-[#f7f4ef] transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function DocumentsTable() {
  const { data, isLoading, refetch } = useListDocuments();
  const createDoc = useCreateDocument();
  const deleteDoc = useDeleteDocument();
  const updateDoc = useUpdateDocument();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

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
          description: (formData.get("description") as string) || undefined,
        }
      });
      toast({ title: "Document added!" });
      setShowForm(false);
      refetch();
    } catch {
      toast({ title: "Could not add document. Try again.", variant: "destructive" });
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDoc) return;
    const formData = new FormData(e.currentTarget);
    try {
      await updateDoc.mutateAsync({
        id: editingDoc.id,
        // @ts-ignore
        data: {
          title: formData.get("title") as string,
          documentType: formData.get("documentType") as string,
          visibility: formData.get("visibility") as string,
          fileUrl: (formData.get("fileUrl") as string) || undefined,
          description: (formData.get("description") as string) || undefined,
        }
      });
      toast({ title: "Document updated!" });
      setEditingDoc(null);
      refetch();
    } catch {
      toast({ title: "Could not update document. Try again.", variant: "destructive" });
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
        {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-[#e5ded3]" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#10231f] mb-1">Documents</h2>
          <p className="text-[#65736f]">Manage your capability statements, case studies, proposals, and reports.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingDoc(null); }}
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
          <DocumentForm onSubmit={handleCreate} buttonText="Save Document" onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Document list */}
      <div className="space-y-3">
        {!data?.documents?.length ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e5ded3]">
            <FileText className="h-10 w-10 mx-auto mb-3 text-[#8a958f] opacity-30" />
            <p className="text-[#65736f] font-medium">No documents yet.</p>
            <p className="text-[#8a958f] text-sm mt-1">Click "Add Document" to get started.</p>
          </div>
        ) : (
          data.documents.map(doc => {
            const visInfo = getVisibility(doc.visibility);
            const docType = getDocType(doc.documentType);
            const isEditing = editingDoc?.id === doc.id;
            const hasPreview = doc.fileUrl && getPreviewUrl(doc.fileUrl);

            return (
              <div key={doc.id} className="bg-white border border-[#e5ded3] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#efe3cf] flex items-center justify-center text-[#c59b4a] shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#10231f] mb-1">{doc.title}</div>
                    {doc.description && (
                      <p className="text-xs text-[#8a958f] mb-2 leading-relaxed">{doc.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-[#f7f4ef] text-[#65736f] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                        {docType.icon} {docType.label}
                      </span>
                      <span className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg ${visInfo.color}`}>
                        {visInfo.icon} {visInfo.label}
                      </span>
                      {doc.createdAt && (
                        <span className="text-[#8a958f]">Added {format(new Date(doc.createdAt), "MMM d, yyyy")}</span>
                      )}
                    </div>

                    {/* File URL status */}
                    <div className="mt-2 flex items-center gap-3">
                      {doc.fileUrl ? (
                        <>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-[#173f35] hover:underline font-medium inline-flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> Open file
                          </a>
                          {hasPreview && (
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="text-xs text-[#c59b4a] hover:underline font-medium inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> Preview
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[#8a958f] italic">No file attached yet</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2.5 rounded-xl border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef] transition-colors"
                      title="Preview document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingDoc(isEditing ? null : doc)}
                      className={`p-2.5 rounded-xl border transition-colors ${isEditing ? "bg-[#173f35] text-white border-[#173f35]" : "border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef]"}`}
                      title="Edit document"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.title)}
                      className="p-2.5 rounded-xl border border-[#e5ded3] text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Remove document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit form */}
                {isEditing && (
                  <div className="border-t border-[#e5ded3] p-5 bg-[#f7f4ef]">
                    <h4 className="font-bold text-[#10231f] mb-4">Edit Document</h4>
                    <DocumentForm defaultValues={editingDoc} onSubmit={handleEdit} buttonText="Save Changes" onCancel={() => setEditingDoc(null)} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Hosting tip */}
      <div className="bg-[#f7f4ef] border border-[#e5ded3] rounded-2xl p-5">
        <p className="text-sm font-semibold text-[#10231f] mb-2">Where to host your files</p>
        <div className="space-y-1.5 text-sm text-[#65736f]">
          <p><span className="font-medium text-[#10231f]">Google Drive:</span> Upload → Share → "Anyone with the link" → Copy link and paste here. The preview will work automatically.</p>
          <p><span className="font-medium text-[#10231f]">Dropbox:</span> Upload → Share → Create link. The preview will open inline.</p>
          <p><span className="font-medium text-[#10231f]">Direct PDF:</span> Paste any direct .pdf URL and it will preview inline.</p>
        </div>
      </div>

      {/* Preview modal */}
      {previewDoc && (
        <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}
