import { useState } from "react";
import { useListServices, useCreateService, useUpdateService, useDeleteService } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, Briefcase, ChevronDown, ChevronUp, GripVertical } from "lucide-react";

type Service = {
  id: number; name: string; icon: string; description: string;
  bullets: string[]; imageUrl?: string | null; category?: string | null;
  displayOrder: number; visible: boolean;
};

const ICON_OPTIONS = ["Briefcase","Landmark","ShieldCheck","TrendingUp","Globe","Award","DollarSign","Users","Building","Zap","Handshake","Target","BarChart2","FileText","Settings","Leaf","Wifi","Truck","Stethoscope"];
const CATEGORY_OPTIONS = ["Advisory","Finance","Development","Compliance","Operations","Strategy","Other"];

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  const add = () => onChange([...bullets, ""]);
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));
  const update = (i: number, v: string) => onChange(bullets.map((b, idx) => idx === i ? v : b));

  return (
    <div>
      <label className="block text-xs font-bold text-[#10231f] mb-2 uppercase tracking-wide">Bullet Points</label>
      <div className="space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 border border-[#e5ded3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]"
              value={b}
              onChange={e => update(i, e.target.value)}
              placeholder={`Bullet point ${i + 1}`}
            />
            <button onClick={() => remove(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1.5 text-sm text-[#173f35] font-semibold hover:underline">
          <Plus size={14} /> Add bullet
        </button>
      </div>
    </div>
  );
}

function ServiceCard({ service, onSave, onDelete }: { service: Service; onSave: (id: number, data: any) => void; onDelete: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...service });

  const handleSave = () => { onSave(service.id, form); setEditing(false); setExpanded(false); };
  const handleCancel = () => { setForm({ ...service }); setEditing(false); };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${!service.visible ? "opacity-60" : ""} ${editing ? "border-[#173f35] shadow-md" : "border-[#e5ded3] hover:shadow-md"}`}>
      <div className="p-4 flex items-center gap-3">
        <div className="text-[#8a958f] cursor-grab shrink-0"><GripVertical size={18} /></div>
        <div className="w-10 h-10 rounded-xl bg-[#173f35] flex items-center justify-center shrink-0">
          <Briefcase className="h-5 w-5 text-[#c59b4a]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#10231f] text-sm">{service.name}</div>
          <div className="text-xs text-[#8a958f] truncate mt-0.5">{service.description}</div>
          <div className="flex items-center gap-2 mt-1">
            {service.category && <span className="text-[10px] bg-[#efe3cf] text-[#173f35] px-2 py-0.5 rounded-full font-semibold">{service.category}</span>}
            <span className="text-[10px] text-[#8a958f]">{service.bullets.length} bullet{service.bullets.length !== 1 ? "s" : ""}</span>
            <span className="text-[10px] text-[#8a958f]">Order: {service.displayOrder}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onSave(service.id, { visible: !service.visible })} className={`p-2 rounded-lg transition-colors ${service.visible ? "text-[#173f35] hover:bg-[#173f35]/10" : "text-[#8a958f] hover:bg-[#f7f4ef]"}`} title={service.visible ? "Hide" : "Show"}>
            {service.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button onClick={() => { setEditing(true); setExpanded(true); }} className="p-2 rounded-lg text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f] transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={() => onDelete(service.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
            <Trash2 size={16} />
          </button>
          <button onClick={() => setExpanded(e => !e)} className="p-2 rounded-lg text-[#65736f] hover:bg-[#f7f4ef] transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && !editing && (
        <div className="border-t border-[#e5ded3] px-4 py-4 bg-[#f7f4ef]/60">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-bold text-[#8a958f] uppercase tracking-wide mb-1">Description</div>
              <p className="text-sm text-[#10231f]">{service.description}</p>
            </div>
            {service.bullets.length > 0 && (
              <div>
                <div className="text-xs font-bold text-[#8a958f] uppercase tracking-wide mb-2">Bullets</div>
                <ul className="space-y-1">
                  {service.bullets.map((b, i) => <li key={i} className="text-sm text-[#10231f] flex items-start gap-2"><span className="text-[#c59b4a] mt-0.5">•</span>{b}</li>)}
                </ul>
              </div>
            )}
            {service.imageUrl && (
              <div>
                <div className="text-xs font-bold text-[#8a958f] uppercase tracking-wide mb-1">Image URL</div>
                <p className="text-xs text-[#65736f] break-all">{service.imageUrl}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editing && (
        <div className="border-t border-[#e5ded3] px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Service Name *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Category</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.category ?? ""} onChange={e => setForm(f => ({ ...f, category: e.target.value || null }))}>
                <option value="">Uncategorized</option>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon Name</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
              <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
              <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Image URL</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.imageUrl ?? ""} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value || null }))} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <BulletEditor bullets={form.bullets} onChange={bullets => setForm(f => ({ ...f, bullets }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef] transition-colors"><X size={14} /> Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e] transition-colors"><Check size={14} /> Save Service</button>
          </div>
        </div>
      )}
    </div>
  );
}

const BLANK_SERVICE = { name: "", icon: "Briefcase", description: "", bullets: [""], imageUrl: "", category: "", displayOrder: 0, visible: true };

export default function ServicesManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useListServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK_SERVICE });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["/api/services"] });

  const handleSave = (id: number, updates: any) => {
    updateMutation.mutate({ id, data: updates }, { onSuccess: invalidate });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this service? It will be removed from the website.")) return;
    deleteMutation.mutate({ id }, { onSuccess: invalidate });
  };

  const handleCreate = () => {
    if (!newForm.name || !newForm.description) return;
    const bullets = newForm.bullets.filter(b => b.trim());
    createMutation.mutate({
      data: {
        name: newForm.name,
        icon: newForm.icon,
        description: newForm.description,
        bullets,
        imageUrl: newForm.imageUrl || null,
        category: newForm.category || null,
        displayOrder: newForm.displayOrder,
        visible: newForm.visible,
      }
    }, {
      onSuccess: () => { invalidate(); setAdding(false); setNewForm({ ...BLANK_SERVICE }); }
    });
  };

  const services = data?.services ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Briefcase className="h-5 w-5 text-[#173f35]" /> Services</h2>
          <p className="text-sm text-[#65736f] mt-0.5">Manage all consulting service cards shown on the homepage and services page.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-2xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Tip:</strong> Services appear on the homepage preview (first 3) and the full Services page. Toggle visibility to hide without deleting. Edit any card by clicking the pencil icon.
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-[#e5ded3] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {services.map(s => <ServiceCard key={s.id} service={s as Service} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}

      {adding && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-md">
          <h3 className="font-bold text-[#10231f] mb-4 flex items-center gap-2"><Plus size={16} className="text-[#c59b4a]" /> New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Service Name *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Government Advisory" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Category</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.category} onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Uncategorized</option>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.icon} onChange={e => setNewForm(f => ({ ...f, icon: e.target.value }))}>
                {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
              <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.displayOrder} onChange={e => setNewForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
              <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={newForm.description} onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this service do?" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Image URL</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.imageUrl} onChange={e => setNewForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <BulletEditor bullets={newForm.bullets} onChange={bullets => setNewForm(f => ({ ...f, bullets }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setNewForm({ ...BLANK_SERVICE }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef] transition-colors"><X size={14} /> Cancel</button>
            <button onClick={handleCreate} disabled={!newForm.name || !newForm.description} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c59b4a] text-[#10231f] text-sm font-bold hover:bg-[#b5893a] transition-colors disabled:opacity-50"><Check size={14} /> Add Service</button>
          </div>
        </div>
      )}
    </div>
  );
}
