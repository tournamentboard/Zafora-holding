"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useAdminTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial,
} from "@/src/modules/admin/content";
import {
  Plus, Trash2, Check, X, ChevronDown, ChevronUp,
  Quote, Eye, EyeOff, Loader2, User,
} from "lucide-react";
import type { Testimonial } from "@/src/lib/types";

const EMPTY = { name: "", company: "", role: "", quote: "", photoUrl: "", displayOrder: 0, visible: true };

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: "text" | "textarea"; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">{label}</label>
      {type === "textarea" ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]" />
      )}
    </div>
  );
}

export default function TestimonialsManager() {
  const { data: items = [], isLoading } = useAdminTestimonials();
  const { mutateAsync: createTestimonial, isPending: addSaving } = useCreateTestimonial();
  const { mutateAsync: updateTestimonial, isPending: saving } = useUpdateTestimonial();
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [editForms, setEditForms] = useState<Record<number, Testimonial>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ ...EMPTY });

  const getForm = (item: Testimonial) => editForms[item.id] ?? item;
  const setField = (id: number, field: keyof Testimonial, value: unknown) =>
    setEditForms((p) => ({ ...p, [id]: { ...(p[id] ?? items.find((i) => i.id === id)!), [field]: value } }));

  const handleUpdate = async (item: Testimonial) => {
    try {
      await updateTestimonial({ id: item.id, data: editForms[item.id] ?? item });
      toast.success("Testimonial updated.");
      setExpanded(null);
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleToggleVisible = async (item: Testimonial) => {
    try {
      await updateTestimonial({ id: item.id, data: { visible: !item.visible } });
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleAdd = async () => {
    if (!newForm.name || !newForm.company || !newForm.quote) {
      toast.error("Name, company, and quote are required.");
      return;
    }
    try {
      await createTestimonial({ ...newForm, displayOrder: items.length });
      toast.success("Testimonial added.");
      setNewForm({ ...EMPTY });
      setAddingNew(false);
    } catch {
      toast.error("Failed to add.");
    }
  };

  if (isLoading) {
    return <div className="space-y-4">{[1,2].map((i) => <div key={i} className="h-24 bg-[#f7f4ef] rounded-2xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Quote className="h-5 w-5 text-[#173f35]" /> Testimonials</h2>
          <p className="text-sm text-[#65736f] mt-0.5">Manage client quotes shown on the website.</p>
        </div>
        <button onClick={() => setAddingNew(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {addingNew && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-[#10231f]">New Testimonial</h3>
            <button onClick={() => { setAddingNew(false); setNewForm({ ...EMPTY }); }} className="text-[#8a958f] hover:text-red-500"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={newForm.name} onChange={(v) => setNewForm((f) => ({ ...f, name: v }))} placeholder="John Smith" />
            <Field label="Company" value={newForm.company} onChange={(v) => setNewForm((f) => ({ ...f, company: v }))} placeholder="Acme Capital" />
            <Field label="Role" value={newForm.role ?? ""} onChange={(v) => setNewForm((f) => ({ ...f, role: v }))} placeholder="Managing Director" />
            <Field label="Photo URL (optional)" value={newForm.photoUrl ?? ""} onChange={(v) => setNewForm((f) => ({ ...f, photoUrl: v }))} placeholder="https://..." />
          </div>
          <Field label="Quote" value={newForm.quote} onChange={(v) => setNewForm((f) => ({ ...f, quote: v }))} type="textarea" placeholder="What they said..." />
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setAddingNew(false); setNewForm({ ...EMPTY }); }} className="px-4 py-2 rounded-xl border border-[#e5ded3] text-[#65736f] text-sm font-semibold hover:bg-[#f7f4ef]">Cancel</button>
            <button onClick={handleAdd} disabled={addSaving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c59b4a] text-white text-sm font-bold hover:bg-[#a8833e] disabled:opacity-60">
              {addSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = expanded === item.id;
          const form = getForm(item);
          return (
            <div key={item.id} className={`bg-white border rounded-2xl shadow-sm transition-all ${isOpen ? "border-[#173f35]" : "border-[#e5ded3]"} ${!item.visible ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.photoUrl ? <img src={item.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" /> : <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#10231f] text-sm truncate">{item.name}</div>
                  <div className="text-xs text-[#65736f] truncate">{item.role ? `${item.role}, ` : ""}{item.company}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleVisible(item)} className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#173f35] transition-colors">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => setExpanded(isOpen ? null : item.id)} className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#10231f] transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a958f] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              {!isOpen && <div className="px-4 pb-4"><p className="text-xs text-[#65736f] italic line-clamp-2">"{item.quote}"</p></div>}
              {isOpen && (
                <div className="px-4 pb-5 border-t border-[#f7f4ef] pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Name" value={form.name} onChange={(v) => setField(item.id, "name", v)} />
                    <Field label="Company" value={form.company} onChange={(v) => setField(item.id, "company", v)} />
                    <Field label="Role" value={form.role ?? ""} onChange={(v) => setField(item.id, "role", v)} />
                    <Field label="Photo URL" value={form.photoUrl ?? ""} onChange={(v) => setField(item.id, "photoUrl", v)} />
                  </div>
                  <Field label="Quote" value={form.quote} onChange={(v) => setField(item.id, "quote", v)} type="textarea" />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setExpanded(null)} className="px-4 py-2 rounded-xl border border-[#e5ded3] text-[#65736f] text-sm font-semibold hover:bg-[#f7f4ef]">Cancel</button>
                    <button onClick={() => handleUpdate(form)} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] disabled:opacity-60">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && !addingNew && (
          <div className="text-center py-12 bg-white border border-[#e5ded3] rounded-2xl">
            <Quote className="h-10 w-10 mx-auto mb-3 text-[#e5ded3]" />
            <p className="font-semibold text-[#10231f] mb-4">No testimonials yet</p>
            <button onClick={() => setAddingNew(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e]">
              <Plus size={14} /> Add First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
