"use client";

import { useState } from "react";
import {
  useMethodologySteps, useCreateMethodologyStep, useUpdateMethodologyStep, useDeleteMethodologyStep,
} from "@/src/modules/admin/content";
import { Plus, Pencil, Trash2, Check, X, Eye, EyeOff, Target, GripVertical } from "lucide-react";
import type { MethodologyStep } from "@/src/lib/types";

const ICON_OPTIONS = ["Target","ShieldCheck","DollarSign","Handshake","TrendingUp","Award","Zap","Users","Briefcase","Globe","BarChart2","FileText","Settings","Building","Leaf","MapPin"];
const BLANK = { stepNumber: 1, title: "", description: "", iconName: "", displayOrder: 0, visible: true };

function StepRow({ step, onSave, onDelete }: {
  step: MethodologyStep;
  onSave: (id: number, data: Partial<MethodologyStep>) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...step });
  const handleSave = () => { onSave(step.id, form); setEditing(false); };
  const handleCancel = () => { setForm({ ...step }); setEditing(false); };

  if (editing) {
    return (
      <div className="bg-white border-2 border-[#173f35] rounded-2xl p-5 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Step Number</label>
            <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.stepNumber} onChange={(e) => setForm((f) => ({ ...f, stepNumber: parseInt(e.target.value) || 1 }))} min={1} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
            <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.iconName ?? ""} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value || null }))}>
              <option value="">None</option>
              {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Title *</label>
            <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
            <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Display Order</label>
            <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e]"><Check size={14} /> Save Step</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-2xl p-4 flex items-start gap-4 hover:shadow-md transition-all ${!step.visible ? "opacity-60" : ""}`}>
      <div className="text-[#8a958f] cursor-grab shrink-0 pt-1"><GripVertical size={18} /></div>
      <div className="w-10 h-10 rounded-xl bg-[#c59b4a]/15 border border-[#c59b4a]/30 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-[#c59b4a]">{String(step.stepNumber).padStart(2, "0")}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[#10231f] text-sm">{step.title}</div>
        <p className="text-xs text-[#65736f] mt-1 leading-relaxed line-clamp-2">{step.description}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onSave(step.id, { visible: !step.visible })} className={`p-2 rounded-lg transition-colors ${step.visible ? "text-[#173f35] hover:bg-[#173f35]/10" : "text-[#8a958f] hover:bg-[#f7f4ef]"}`}>{step.visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
        <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f] transition-colors"><Pencil size={16} /></button>
        <button onClick={() => onDelete(step.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export default function MethodologyManager() {
  const { data: steps = [], isLoading } = useMethodologySteps();
  const { mutateAsync: createStep } = useCreateMethodologyStep();
  const { mutateAsync: updateStep } = useUpdateMethodologyStep();
  const { mutateAsync: deleteStep } = useDeleteMethodologyStep();
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ ...BLANK });

  const handleSave = (id: number, updates: Partial<MethodologyStep>) => {
    updateStep({ id, data: updates as Parameters<typeof updateStep>[0]["data"] });
  };
  const handleDelete = (id: number) => {
    if (!confirm("Delete this step?")) return;
    deleteStep(id);
  };
  const handleCreate = () => {
    if (!newForm.title || !newForm.description) return;
    createStep({
      stepNumber: newForm.stepNumber, title: newForm.title, description: newForm.description,
      iconName: newForm.iconName || undefined, displayOrder: newForm.displayOrder, visible: newForm.visible,
    }).then(() => { setAdding(false); setNewForm({ ...BLANK }); });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Target className="h-5 w-5 text-[#173f35]" /> Delivery Methodology</h2>
          <p className="text-sm text-[#65736f] mt-0.5">The delivery model steps shown on the homepage.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md"><Plus size={16} /> Add Step</button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-20 bg-white rounded-2xl border border-[#e5ded3] animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {steps.map((step) => <StepRow key={step.id} step={step} onSave={handleSave} onDelete={handleDelete} />)}
        </div>
      )}

      {adding && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-md">
          <h3 className="font-bold text-[#10231f] mb-4 flex items-center gap-2"><Plus size={16} className="text-[#c59b4a]" /> New Step</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Step Number</label>
              <input type="number" className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.stepNumber} onChange={(e) => setNewForm((f) => ({ ...f, stepNumber: parseInt(e.target.value) || 1 }))} min={1} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Icon</label>
              <select className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.iconName} onChange={(e) => setNewForm((f) => ({ ...f, iconName: e.target.value }))}>
                <option value="">None</option>
                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Title *</label>
              <input className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]" value={newForm.title} onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Capital Raising" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Description *</label>
              <textarea className="w-full border border-[#e5ded3] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none" rows={3} value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setNewForm({ ...BLANK }); }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#e5ded3] text-[#65736f] text-sm hover:bg-[#f7f4ef]"><X size={14} /> Cancel</button>
            <button onClick={handleCreate} disabled={!newForm.title || !newForm.description} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#c59b4a] text-[#10231f] text-sm font-bold hover:bg-[#b5893a] disabled:opacity-50"><Check size={14} /> Add Step</button>
          </div>
        </div>
      )}
    </div>
  );
}
