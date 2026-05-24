"use client";

import { useState } from "react";
import {
  useContentStats, useCreateContentStat, useUpdateContentStat, useDeleteContentStat,
} from "@/src/modules/admin/content";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, GripVertical, BarChart2 } from "lucide-react";
import type { ContentStat } from "@/src/lib/types";

const ICON_OPTIONS = ["DollarSign","Globe","Award","Briefcase","Users","TrendingUp","BarChart2","MapPin","Building","Zap","Shield","Target","Star","Clock","Handshake"];
const BLANK = { label: "", value: "", suffix: "", description: "", iconName: "", displayOrder: 0, visible: true };

function StatRow({ stat, onSave, onDelete }: {
  stat: ContentStat;
  onSave: (id: number, data: Partial<ContentStat>) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...stat });
  const handleSave = () => { onSave(stat.id, form); setEditing(false); };
  const handleCancel = () => { setForm({ ...stat }); setEditing(false); };

  if (editing) {
    return (
      <div className="bg-white border-2 border-[#173f35] rounded-2xl p-5 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Label</label>
            <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Value</label>
            <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="e.g. $2.4B" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Suffix</label>
            <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.suffix ?? ""} onChange={(e) => setForm((f) => ({ ...f, suffix: e.target.value || null }))} placeholder="e.g. +" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
            <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.iconName ?? ""} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value || null }))}>
              <option value="">None</option>
              {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description</label>
            <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
            <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e]"><Check size={14} /> Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all ${!stat.visible ? "opacity-60" : ""}`}>
      <div className="text-[#8a958f] cursor-grab shrink-0"><GripVertical size={18} /></div>
      <div className="w-16 h-16 rounded-xl bg-[#173f35]/8 flex items-center justify-center shrink-0">
        <div className="text-2xl font-bold text-[#173f35] leading-none">{stat.value}{stat.suffix}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#10231f] text-sm">{stat.label}</div>
        {stat.description && <div className="text-xs text-[#8a958f] mt-0.5 truncate">{stat.description}</div>}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] bg-[#efe3cf] text-[#173f35] px-2 py-0.5 rounded-full font-semibold">Order: {stat.displayOrder}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onSave(stat.id, { visible: !stat.visible })} className={`p-2 rounded-lg transition-colors ${stat.visible ? "text-[#173f35] hover:bg-[#173f35]/10" : "text-[#8a958f] hover:bg-[#f7f4ef]"}`}>{stat.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
        <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f] transition-colors"><Pencil size={16} /></button>
        <button onClick={() => onDelete(stat.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function ContentStatsManager() {
  const { data: stats = [], isLoading } = useContentStats();
  const { mutateAsync: createStat } = useCreateContentStat();
  const { mutateAsync: updateStat } = useUpdateContentStat();
  const { mutateAsync: deleteStat } = useDeleteContentStat();
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK });

  const handleSave = (id: number, updates: Partial<ContentStat>) => {
    updateStat({ id, data: updates as Parameters<typeof updateStat>[0]["data"] });
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this stat?")) return;
    deleteStat(id);
  };
  const handleCreate = () => {
    if (!newForm.label || !newForm.value) return;
    createStat({
      label: newForm.label, value: newForm.value,
      suffix: newForm.suffix || undefined, description: newForm.description || undefined,
      iconName: newForm.iconName || undefined, displayOrder: newForm.displayOrder, visible: newForm.visible,
    }).then(() => { setAdding(false); setNewForm({ ...BLANK }); });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><BarChart2 className="h-5 w-5 text-[#173f35]" /> Site Stats</h2>
          <p className="text-sm text-[#65736f] mt-0.5">Numbers shown on your homepage. Edit any value to update it live.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md"><Plus size={16} /> Add Stat</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-20 bg-white rounded-2xl border border-[#e5ded3] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {stats.map((stat) => <StatRow key={stat.id} stat={stat} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}

      {adding && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-md">
          <h3 className="font-bold text-[#10231f] mb-4 flex items-center gap-2"><Plus size={16} className="text-[#c59b4a]" /> New Stat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Label *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.label} onChange={(e) => setNewForm((f) => ({ ...f, label: e.target.value }))} placeholder="e.g. African Countries Active" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Value *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.value} onChange={(e) => setNewForm((f) => ({ ...f, value: e.target.value }))} placeholder="e.g. 12 or $2.4B" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Suffix</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.suffix} onChange={(e) => setNewForm((f) => ({ ...f, suffix: e.target.value }))} placeholder="e.g. +" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.iconName} onChange={(e) => setNewForm((f) => ({ ...f, iconName: e.target.value }))}>
                <option value="">None</option>
                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
              <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.displayOrder} onChange={(e) => setNewForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setNewForm({ ...BLANK }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
            <button onClick={handleCreate} disabled={!newForm.label || !newForm.value} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c59b4a] text-[#10231f] text-sm font-bold hover:bg-[#b5893a] disabled:opacity-50"><Check size={14} /> Add Stat</button>
          </div>
        </div>
      )}
    </div>
  );
}
