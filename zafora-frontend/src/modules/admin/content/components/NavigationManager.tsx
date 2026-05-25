"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import {
  Plus, Trash2, Check, Eye, EyeOff,
  Navigation, Loader2, ExternalLink, X, ChevronUp, ChevronDown
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  openNewTab: boolean;
  order: number;
};

const DEFAULT_NAV: NavItem[] = [
  { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
  { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
  { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
  { id: "gov", label: "Government Review", href: "/government-review", visible: true, openNewTab: false, order: 3 },
];

const newId = () => Math.random().toString(36).slice(2, 9);

export default function NavigationManager() {
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Omit<NavItem, "id" | "order">>({ label: "", href: "", visible: true, openNewTab: false });

  useEffect(() => {
    apiAxios
      .get<{ key: string; value: string }>(API.CONTENT.SETTINGS("navigation"))
      .then((r) => {
        try {
          const val = JSON.parse(r.data.value);
          if (Array.isArray(val) && val.length > 0) setItems(val);
        } catch {}
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async (nav: NavItem[]) => {
    setSaving(true);
    try {
      await apiAxios.patch(API.CONTENT.SETTINGS("navigation"), { value: JSON.stringify(nav) });
      toast.success("Navigation saved.");
    } catch {
      toast.error("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => save(items);

  const moveItem = (index: number, dir: "up" | "down") => {
    const next = [...items];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setItems(next.map((it, i) => ({ ...it, order: i })));
  };

  const toggleVisible = (id: string) =>
    setItems((items) => items.map((i) => (i.id === id ? { ...i, visible: !i.visible } : i)));

  const toggleNewTab = (id: string) =>
    setItems((items) => items.map((i) => (i.id === id ? { ...i, openNewTab: !i.openNewTab } : i)));

  const updateField = (id: string, field: keyof NavItem, val: NavItem[keyof NavItem]) =>
    setItems((items) => items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  const deleteItem = (id: string) => setItems((items) => items.filter((i) => i.id !== id));

  const handleAdd = () => {
    if (!newItem.label || !newItem.href) {
      toast.error("Label and link are required.");
      return;
    }
    const item: NavItem = { ...newItem, id: newId(), order: items.length };
    setItems((prev) => [...prev, item]);
    setNewItem({ label: "", href: "", visible: true, openNewTab: false });
    setAddingNew(false);
  };

  if (loading)
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-[#f7f4ef] rounded-2xl animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2">
            <Navigation className="h-5 w-5 text-[#173f35]" /> Navigation Menu
          </h2>
          <p className="text-sm text-[#65736f] mt-0.5">
            Control what links appear in the website header.
          </p>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" /> Add Link
        </button>
      </div>

      {addingNew && (
        <div className="bg-white border-2 border-[#c59b4a] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#10231f] text-sm">New Navigation Link</h3>
            <button onClick={() => setAddingNew(false)} className="text-[#8a958f] hover:text-red-500">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">Link Label</label>
              <input
                type="text"
                value={newItem.label}
                onChange={(e) => setNewItem((f) => ({ ...f, label: e.target.value }))}
                placeholder="e.g. Contact"
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">URL / Path</label>
              <input
                type="text"
                value={newItem.href}
                onChange={(e) => setNewItem((f) => ({ ...f, href: e.target.value }))}
                placeholder="/contact or https://..."
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#173f35]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-[#65736f] cursor-pointer">
              <input
                type="checkbox"
                checked={newItem.openNewTab}
                onChange={(e) => setNewItem((f) => ({ ...f, openNewTab: e.target.checked }))}
                className="rounded"
              />
              Open in new tab
            </label>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setAddingNew(false)}
              className="px-4 py-2 rounded-xl border border-[#e5ded3] text-[#65736f] text-sm font-semibold hover:bg-[#f7f4ef]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c59b4a] text-white text-sm font-bold hover:bg-[#a8833e] transition-colors"
            >
              <Check size={14} /> Add Link
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`bg-white border rounded-2xl shadow-sm transition-all ${!item.visible ? "opacity-60" : "border-[#e5ded3]"}`}
          >
            <div className="flex items-center gap-3 p-4">
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                  className="p-0.5 text-[#c5c0b8] hover:text-[#173f35] disabled:opacity-30 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                  className="p-0.5 text-[#c5c0b8] hover:text-[#173f35] disabled:opacity-30 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#173f35] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateField(item.id, "label", e.target.value)}
                  className="font-semibold text-sm text-[#10231f] border-none bg-transparent focus:outline-none focus:bg-[#f7f4ef] rounded px-1 py-0.5 w-full max-w-[140px]"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateField(item.id, "href", e.target.value)}
                  className="text-xs text-[#65736f] border-none bg-transparent focus:outline-none focus:bg-[#f7f4ef] rounded px-1 py-0.5 w-full max-w-[200px]"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.openNewTab && (
                  <span className="text-[10px] font-medium text-[#8a958f] flex items-center gap-1 bg-[#f7f4ef] px-2 py-1 rounded-full">
                    <ExternalLink size={10} /> New tab
                  </span>
                )}
                {!item.visible && (
                  <span className="text-[10px] font-bold bg-[#f7f4ef] text-[#8a958f] px-2 py-1 rounded-full uppercase tracking-wide">
                    Hidden
                  </span>
                )}
                <button
                  onClick={() => toggleVisible(item.id)}
                  title={item.visible ? "Hide" : "Show"}
                  className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#173f35] transition-colors"
                >
                  {item.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => toggleNewTab(item.id)}
                  title="Toggle new tab"
                  className="p-1.5 rounded-lg hover:bg-[#f7f4ef] text-[#8a958f] hover:text-[#173f35] transition-colors"
                >
                  <ExternalLink size={15} />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#8a958f] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors shadow-md disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          Save Navigation
        </button>
      </div>
    </div>
  );
}
