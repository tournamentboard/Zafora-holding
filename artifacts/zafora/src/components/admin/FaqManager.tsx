import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2, Trash2, ChevronRight, ArrowLeft, Eye, EyeOff, HelpCircle, Check } from "lucide-react";

const PAGES = ["general", "home", "about", "services", "projects", "government", "submit"];
const CATEGORIES = ["general", "services", "pipeline", "government", "investment", "process"];

type Faq = {
  id?: number;
  question: string;
  answer: string;
  category: string;
  page: string;
  displayOrder: number;
  visible: boolean;
};

const EMPTY: Faq = { question: "", answer: "", category: "general", page: "general", displayOrder: 0, visible: true };

async function apiFetch(url: string, options?: RequestInit) {
  const r = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
  if (!r.ok) throw new Error(await r.text());
  if (r.status === 204) return null;
  return r.json();
}

export default function FaqManager() {
  const qc = useQueryClient();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Faq | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filterPage, setFilterPage] = useState("all");

  useEffect(() => {
    if (loaded) return;
    setLoading(true);
    apiFetch("/api/content/faqs")
      .then(data => { setFaqs(data.faqs ?? []); setLoaded(true); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [loaded]);

  if (!loaded) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;
  }

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      if (isNew) {
        const created = await apiFetch("/api/content/faqs", { method: "POST", body: JSON.stringify(selected) });
        setFaqs(prev => [...prev, created]);
      } else {
        const updated = await apiFetch(`/api/content/faqs/${selected.id}`, { method: "PATCH", body: JSON.stringify(selected) });
        setFaqs(prev => prev.map(f => f.id === updated.id ? updated : f));
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); setSelected(null); setIsNew(false); }, 1000);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    await apiFetch(`/api/content/faqs/${selected.id}`, { method: "DELETE" });
    setFaqs(prev => prev.filter(f => f.id !== selected.id));
    setSelected(null);
    setConfirmDelete(false);
  };

  const toggleVisible = async (faq: Faq) => {
    const updated = await apiFetch(`/api/content/faqs/${faq.id}`, { method: "PATCH", body: JSON.stringify({ visible: !faq.visible }) });
    setFaqs(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const setField = (key: keyof Faq, val: any) => setSelected(prev => prev ? { ...prev, [key]: val } : prev);

  // ── Edit view ──────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => { setSelected(null); setIsNew(false); setConfirmDelete(false); }} className="flex items-center gap-2 text-sm text-[#65736f] hover:text-[#173f35] transition-colors">
            <ArrowLeft size={15} /> FAQs
          </button>
          <ChevronRight size={13} className="text-[#d0c9bf]" />
          <span className="text-sm font-semibold text-[#10231f]">{isNew ? "New FAQ" : "Edit FAQ"}</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#10231f]">{isNew ? "Add New FAQ" : "Edit FAQ"}</h1>
          <button onClick={handleSave} disabled={saving || !selected.question || !selected.answer}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] disabled:opacity-60 transition-colors">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
            {saved ? "Saved" : "Save FAQ"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Question</label>
                <input type="text" value={selected.question} onChange={e => setField("question", e.target.value)}
                  placeholder="What services does Zafora Holding offer?"
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Answer</label>
                <textarea rows={6} value={selected.answer} onChange={e => setField("answer", e.target.value)}
                  placeholder="Zafora Holding provides end-to-end infrastructure advisory services..."
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white resize-y" />
              </div>
            </div>

            {!isNew && (
              <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#10231f]">Delete FAQ</p>
                  <p className="text-xs text-[#8a958f] mt-0.5">Permanently removes this item.</p>
                </div>
                <button onClick={handleDelete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${confirmDelete ? "bg-red-500 text-white border-red-500" : "text-red-500 border-red-200 hover:bg-red-50"}`}>
                  <Trash2 size={14} />
                  {confirmDelete ? "Confirm Delete" : "Delete"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-4">
              <h2 className="font-bold text-[#10231f] text-base">Settings</h2>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#10231f]">Visible</p>
                <button onClick={() => setField("visible", !selected.visible)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selected.visible ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${selected.visible ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Show on Page</label>
                <select value={selected.page} onChange={e => setField("page", e.target.value)}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white appearance-none cursor-pointer capitalize">
                  {PAGES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Category</label>
                <select value={selected.category} onChange={e => setField("category", e.target.value)}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white appearance-none cursor-pointer capitalize">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Display Order</label>
                <input type="number" min={0} value={selected.displayOrder} onChange={e => setField("displayOrder", Number(e.target.value))}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white" />
                <p className="text-[11px] text-[#8a958f]">Lower numbers appear first.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────
  const filtered = filterPage === "all" ? faqs : faqs.filter(f => f.page === filterPage);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">FAQs</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">{faqs.length} question{faqs.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={() => { setSelected({ ...EMPTY, displayOrder: faqs.length }); setIsNew(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] transition-colors">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      {/* Page filter */}
      <div className="flex flex-wrap gap-2">
        {["all", ...PAGES].map(p => (
          <button key={p} onClick={() => setFilterPage(p)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filterPage === p ? "bg-[#173f35] text-white" : "bg-white border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef]"}`}>
            {p === "all" ? "All pages" : p}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5ded3] py-16 text-center">
          <HelpCircle className="h-10 w-10 text-[#d0c9bf] mx-auto mb-4" />
          <p className="text-[#65736f] font-medium">No FAQs yet.</p>
          <button onClick={() => { setSelected({ ...EMPTY }); setIsNew(true); }} className="mt-3 text-sm text-[#173f35] font-semibold hover:underline">
            Add your first question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {[...filtered].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)).map(faq => (
            <div key={faq.id} className="bg-white rounded-2xl border border-[#e5ded3] p-5 flex gap-4 items-start hover:shadow-sm transition-all group">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setSelected({ ...faq }); setIsNew(false); }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#10231f] leading-snug">{faq.question}</p>
                    <p className="text-xs text-[#8a958f] mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8a958f]">
                  <span className="px-2 py-0.5 rounded-full bg-[#f0ebe3] capitalize">{faq.page}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f0ebe3] capitalize">{faq.category}</span>
                  <span>Order: {faq.displayOrder}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${faq.visible ? "bg-green-100 text-green-700" : "bg-[#e5ded3] text-[#8a958f]"}`}>
                  {faq.visible ? "Visible" : "Hidden"}
                </span>
                <button onClick={() => toggleVisible(faq)} className="p-1.5 rounded-lg hover:bg-[#f7f4ef] transition-colors text-[#8a958f]" title={faq.visible ? "Hide" : "Show"}>
                  {faq.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
