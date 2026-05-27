"use client";

import { useState } from "react";
import {
  useAdminServices, useCreateService, useUpdateService, useDeleteService,
} from "@/src/modules/admin/content";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, Briefcase, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { CatalogService } from "@/src/lib/types";
import { PhotoUploadField } from "@/src/modules/admin/shared/components/PhotoUploadField";
import { STORAGE_FOLDER } from "@/src/lib/constants";

const ICON_OPTIONS = ["Briefcase","Landmark","ShieldCheck","TrendingUp","Globe","Award","DollarSign","Users","Building","Zap","Handshake","Target","BarChart2","FileText","Settings","Leaf","Wifi","Truck","Stethoscope"];
const CATEGORY_OPTIONS = ["Advisory","Finance","Development","Compliance","Operations","Strategy","Other"];
const BLANK = { name: "", icon: "Briefcase", description: "", bullets: [""], imageUrl: "", category: "", displayOrder: 0, visible: true };

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
            <input className="flex-1 border border-[#e5ded3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={b} onChange={(e) => update(i, e.target.value)} placeholder={`Bullet ${i + 1}`} />
            <button onClick={() => remove(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><X size={14} /></button>
          </div>
        ))}
        <button onClick={add} className="flex items-center gap-1.5 text-sm text-[#173f35] font-semibold hover:underline"><Plus size={14} /> Add bullet</button>
      </div>
    </div>
  );
}

function ServiceCard({ service, onSave, onDelete }: {
  service: CatalogService;
  onSave: (id: number, data: Partial<CatalogService>) => void;
  onDelete: (id: number) => void;
}) {
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
            <span className="text-[10px] text-[#8a958f]">Order: {service.displayOrder}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onSave(service.id, { visible: !service.visible })} className={`p-2 rounded-lg transition-colors ${service.visible ? "text-[#173f35] hover:bg-[#173f35]/10" : "text-[#8a958f] hover:bg-[#f7f4ef]"}`}>{service.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
          <button onClick={() => { setEditing(true); setExpanded(true); }} className="p-2 rounded-lg text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f]"><Pencil size={16} /></button>
          <button onClick={() => onDelete(service.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
          <button onClick={() => setExpanded((e) => !e)} className="p-2 rounded-lg text-[#65736f] hover:bg-[#f7f4ef]">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </div>
      </div>

      {expanded && !editing && (
        <div className="border-t border-[#e5ded3] px-4 py-4 bg-[#f7f4ef]/60 space-y-3">
          <p className="text-sm text-[#10231f]">{service.description}</p>
          {service.bullets?.length > 0 && (
            <ul className="space-y-1">
              {service.bullets.map((b, i) => <li key={i} className="text-sm text-[#10231f] flex items-start gap-2"><span className="text-[#c59b4a] mt-0.5">•</span>{b}</li>)}
            </ul>
          )}
        </div>
      )}

      {editing && (
        <div className="border-t border-[#e5ded3] px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Name *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Category</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.category ?? ""} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value || null }))}>
                <option value="">Uncategorized</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}>
                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
              <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
              <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <PhotoUploadField
                folder={STORAGE_FOLDER.SERVICES_IMAGES}
                label="SERVICE IMAGE"
                value={form.imageUrl ?? ""}
                onChange={(v) => setForm((f) => ({ ...f, imageUrl: v || null }))}
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <BulletEditor bullets={form.bullets ?? []} onChange={(bullets) => setForm((f) => ({ ...f, bullets }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e]"><Check size={14} /> Save Service</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesManager() {
  const { data: services = [], isLoading } = useAdminServices();
  const { mutateAsync: createService } = useCreateService();
  const { mutateAsync: updateService } = useUpdateService();
  const { mutateAsync: deleteService } = useDeleteService();
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK });

  const handleSave = (id: number, updates: Partial<CatalogService>) => {
    updateService({ id, data: updates as Parameters<typeof updateService>[0]["data"] });
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this service?")) return;
    deleteService(id);
  };
  const handleCreate = () => {
    if (!newForm.name || !newForm.description) return;
    const bullets = newForm.bullets.filter((b) => b.trim());
    createService({
      name: newForm.name, icon: newForm.icon, description: newForm.description,
      bullets, imageUrl: newForm.imageUrl || undefined,
      category: newForm.category || undefined, displayOrder: newForm.displayOrder, visible: newForm.visible,
    }).then(() => { setAdding(false); setNewForm({ ...BLANK }); });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Briefcase className="h-5 w-5 text-[#173f35]" /> Services</h2>
          <p className="text-sm text-[#65736f] mt-0.5">Manage consulting service cards shown on the homepage and services page.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md"><Plus size={16} /> Add Service</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 bg-white rounded-2xl border border-[#e5ded3] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => <ServiceCard key={s.id} service={s} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}

      {adding && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-md">
          <h3 className="font-bold text-[#10231f] mb-4 flex items-center gap-2"><Plus size={16} className="text-[#c59b4a]" /> New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Name *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Government Advisory" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Category</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.category} onChange={(e) => setNewForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="">Uncategorized</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
              <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} placeholder="What does this service do?" />
            </div>
            <div className="md:col-span-2">
              <BulletEditor bullets={newForm.bullets} onChange={(bullets) => setNewForm((f) => ({ ...f, bullets }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setNewForm({ ...BLANK }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
            <button onClick={handleCreate} disabled={!newForm.name || !newForm.description} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c59b4a] text-[#10231f] text-sm font-bold hover:bg-[#b5893a] disabled:opacity-50"><Check size={14} /> Add Service</button>
          </div>
        </div>
      )}
    </div>
  );
}
