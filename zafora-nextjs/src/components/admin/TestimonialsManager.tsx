import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Trash2, Check, X, ChevronDown, ChevronUp,
  Quote, Eye, EyeOff, Loader2, User, GripVertical
} from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  company: string;
  role: string | null;
  quote: string;
  photoUrl: string | null;
  displayOrder: number;
  visible: boolean;
};

const EMPTY: Omit<Testimonial, "id"> = {
  name: "", company: "", role: "", quote: "",
  photoUrl: "", displayOrder: 0, visible: true,
};

function Field({ label, value, onChange, type = "text", placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: "text" | "textarea" | "url"; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">{label}</label>
      {type === "textarea" ? (
        <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]" />
      )}
      {hint && <p className="text-xs text-[#8a958f] mt-1">{hint}</p>}
    </div>
  );
}

export default function TestimonialsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState(EMPTY);
  const [addSaving, setAddSaving] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    fetch("/api/testimonials").then(r => r.json()).then(d => {
      setItems(d.testimonials || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleUpdate = async (item: Testimonial) => {
    setSaving(item.id);
    try {
      const r = await fetch(`/api/testimonials/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Testimonial updated." });
      fetchAll();
      setExpanded(null);
    } catch {
      toast({ title: "Failed to update.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const handleToggleVisible = async (item: Testimonial) => {
    setSaving(item.id);
    try {
      await fetch(`/api/testimonials/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !item.visible }),
      });
      fetchAll();
    } catch {
      toast({ title: "Failed to update.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    toast({ title: "Testimonial deleted." });
    fetchAll();
  };

  const handleAdd = async () => {
    if (!newForm.name || !newForm.company || !newForm.quote) {
      toast({ title: "Name, company, and quote are required.", variant: "destructive" });
      return;
    }
    setAddSaving(true);
    try {
      const r = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, displayOrder: items.length }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Testimonial added." });
      setNewForm(EMPTY);
      setAddingNew(false);
      fetchAll();
    } catch {
      toast({ title: "Failed to add.", variant: "destructive" });
    } finally {
      setAddSaving(false);
    }
  };

  const updateLocal = (id: number, field: string, value: any) =>
    setItems(items => items.map(i => i.id === id ? { ...i, [field]: value } : i));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-[#f7f4ef] rounded-xl w-48 animate-pulse" />
        {[1, 2].map(i => <div key={i} className="h-24 bg-[#f7f4ef] rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2">
            <Quote className="h-5 w-5 text-[#173f35]" /> Testimonials
          </h2>
          <p className="text-sm text-[#65736f] mt-0.5">
            Manage client quotes shown on the website. Toggle visibility or edit any testimonial.
          </p>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {/* Add new form */}
      {addingNew && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-[#10231f]">New Testimonial</h3>
            <button onClick={() => { setAddingNew(false); setNewForm(EMPTY); }}
              className="text-[#8a958f] hover:text-red-500 transition-colors"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={newForm.name} onChange={v => setNewForm(f => ({ ...f, name: v }))} placeholder="John Smith" />
            <Field label="Company" value={newForm.company} onChange={v => setNewForm(f => ({ ...f, company: v }))} placeholder="Acme Capital Partners" />
            <Field label="Role / Title" value={newForm.role || ""} onChange={v => setNewForm(f => ({ ...f, role: v }))} placeholder="Managing Director" />
            <Field label="Photo URL (optional)" value={newForm.photoUrl || ""} onChange={v => setNewForm(f => ({ ...f, photoUrl: v }))} placeholder="https://..." />
          </div>
          <Field label="Quote" value={newForm.quote} onChange={v => setNewForm(f => ({ ...f, quote: v }))} type="textarea"
            placeholder="What they said about working with Zafora..." />
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setAddingNew(false); setNewForm(EMPTY); }}
              className="px-4 py-2 rounded-xl border border-[#e5ded3] text-[#65736f] text-sm font-semibold hover:bg-[#f7f4ef]">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={addSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c59b4a] text-white text-sm font-bold hover:bg-[#a8833e] transition-colors disabled:opacity-60">
              {addSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Testimonial
            </button>
          </div>
        </div>
      )}

      {/* Testimonial list */}
      <div className="space-y-3">
        {items.map(item => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id}
              className={`bg-white border rounded-2xl shadow-sm transition-all ${isOpen ? "border-[#173f35]" : "border-[#e5ded3]"} ${!item.visible ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.photoUrl
                    ? <img src={item.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    : <User size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#10231f] text-sm truncate">{item.name}</div>
                  <div className="text-xs text-[#65736f] truncate">{item.role ? `${item.role}, ` : ""}{item.company}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!item.visible && (
                    <span className="text-[10px] font-bold bg-[#f7f4ef] text-[#8a958f] px-2 py-1 rounded-full uppercase tracking-wide">Hidden</span>
                  )}
                  <button onClick={() => handleToggleVisible(item)} title={item.visible ? "Hide" : "Show"}
                    className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#173f35] transition-colors">
                    {saving === item.id ? <Loader2 size={16} className="animate-spin" /> : item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => setExpanded(isOpen ? null : item.id)}
                    className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#10231f] transition-colors">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a958f] hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {!isOpen && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-[#65736f] italic line-clamp-2">"{item.quote}"</p>
                </div>
              )}

              {isOpen && (
                <div className="px-4 pb-5 border-t border-[#f7f4ef] pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Name" value={item.name}
                      onChange={v => updateLocal(item.id, "name", v)} />
                    <Field label="Company" value={item.company}
                      onChange={v => updateLocal(item.id, "company", v)} />
                    <Field label="Role / Title" value={item.role || ""}
                      onChange={v => updateLocal(item.id, "role", v)} placeholder="Managing Director" />
                    <Field label="Photo URL (optional)" value={item.photoUrl || ""}
                      onChange={v => updateLocal(item.id, "photoUrl", v)} placeholder="https://..." />
                  </div>
                  <Field label="Quote" value={item.quote}
                    onChange={v => updateLocal(item.id, "quote", v)} type="textarea" />
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setExpanded(null)}
                      className="px-4 py-2 rounded-xl border border-[#e5ded3] text-[#65736f] text-sm font-semibold hover:bg-[#f7f4ef]">
                      Cancel
                    </button>
                    <button onClick={() => handleUpdate(item)} disabled={saving === item.id}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60">
                      {saving === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Save Changes
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
            <p className="font-semibold text-[#10231f] mb-1">No testimonials yet</p>
            <p className="text-sm text-[#8a958f] mb-4">Add a client quote to display on the website</p>
            <button onClick={() => setAddingNew(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors">
              <Plus size={14} /> Add First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
