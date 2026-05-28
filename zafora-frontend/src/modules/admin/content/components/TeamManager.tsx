"use client";

import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings, siteSettingsKeys } from "../services/site-settings.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Plus, Loader2, Check, Trash2, Mail,
  MapPin, ChevronRight, Users, Eye, EyeOff, FileText,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { PhotoUploadField } from "@/src/modules/admin/shared/components/PhotoUploadField";
import { STORAGE_FOLDER } from "@/src/lib/constants";

const TEAM_COLORS = [
  "bg-[#173f35]", "bg-[#245d4e]", "bg-[#c59b4a]",
  "bg-[#1a3a5c]", "bg-[#6b4e2a]", "bg-[#4a3f6b]",
];

const MEMBER_TEMPLATE = {
  initials: "ZH",
  firstName: "",
  lastName: "",
  name: "",
  title: "",
  department: "",
  bio: "",
  location: "",
  photo: "",
  linkedin: "",
  email: "",
  visible: true,
  sortOrder: 99,
  status: "published",
  cardStyle: "default",
  notes: "",
};

function deepMerge(base: any, override: any): any {
  if (!override || typeof override !== "object") return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (Array.isArray(override[key])) result[key] = override[key];
    else if (typeof override[key] === "object" && typeof base[key] === "object" && !Array.isArray(base[key]))
      result[key] = deepMerge(base[key], override[key]);
    else result[key] = override[key];
  }
  return result;
}

function Field({ label, value, onChange, placeholder, type = "text", helper, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: "text" | "textarea"; helper?: string; maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-[#10231f] block">{label}</label>
      {type === "textarea" ? (
        <div>
          <textarea
            rows={5}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white resize-y"
          />
          {maxLength !== undefined && (
            <p className={`text-[11px] text-right mt-0.5 ${value.length > maxLength ? "text-red-500 font-semibold" : "text-[#8a958f]"}`}>
              {value.length} / {maxLength}
            </p>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
        />
      )}
      {helper && <p className="text-[11px] text-[#8a958f]">{helper}</p>}
    </div>
  );
}

export default function TeamManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("about");
  const updateMutation = useUpdateSiteSettings();

  const [fullSettings, setFullSettings] = useState<any>({});
  const [team, setTeam] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setFullSettings(parsed);
        const members = (parsed.team ?? []).map((m: any, i: number) =>
          deepMerge({ ...MEMBER_TEMPLATE, sortOrder: i + 1 }, m)
        );
        setTeam(members);
      } catch {}
    }
  }, [data?.value]);

  const member: any = selectedIdx !== null ? (team[selectedIdx] ?? null) : null;

  const setField = (key: string, val: any) => {
    setTeam(prev => {
      const next = [...prev];
      next[selectedIdx!] = { ...next[selectedIdx!], [key]: val };
      return next;
    });
  };

  const handleSave = () => {
    // Keep visible in sync with status for backward compat
    const syncedTeam = team.map(m => ({
      ...m,
      visible: m.status !== "draft",
      name: m.name || `${m.firstName} ${m.lastName}`.trim() || m.initials,
    }));
    const payload = { ...fullSettings, team: syncedTeam };
    updateMutation.mutate(
      { key: "about", data: { value: JSON.stringify(payload) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: siteSettingsKeys.single("about") });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setTeam(prev => prev.filter((_, i) => i !== selectedIdx));
    setSelectedIdx(null);
    setConfirmDelete(false);
    setTimeout(handleSave, 50);
  };

  const handleAddMember = () => {
    const newMember = { ...MEMBER_TEMPLATE, sortOrder: team.length + 1 };
    setTeam(prev => [...prev, newMember]);
    setSelectedIdx(team.length);
  };

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-[#173f35]" />
    </div>
  );

  // ── Edit View ──────────────────────────────────────────────────────
  if (selectedIdx !== null && member) {
    const displayName = member.name || `${member.firstName} ${member.lastName}`.trim() || "New Member";
    const isPublished = member.status !== "draft";

    return (
      <div className="space-y-0">
        {/* Breadcrumb + header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setSelectedIdx(null); setConfirmDelete(false); }}
            className="flex items-center gap-2 text-sm text-[#65736f] hover:text-[#173f35] transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Leadership Team</span>
          </button>
          <ChevronRight size={13} className="text-[#d0c9bf]" />
          <span className="text-sm font-semibold text-[#10231f]">Edit Member</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#10231f]">Edit Leadership Team Member</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] transition-colors disabled:opacity-60"
            >
              {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Left: Member Information */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-6 space-y-5">
              <div>
                <h2 className="font-bold text-[#10231f] text-base mb-1">Member Information</h2>
                <p className="text-xs text-[#8a958f]">Add or update leadership team member details.</p>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" value={member.firstName ?? ""} onChange={v => setField("firstName", v)} placeholder="John" />
                <Field label="Last Name" value={member.lastName ?? ""} onChange={v => setField("lastName", v)} placeholder="Smith" />
              </div>

              <Field
                label="Display Name / Team Name"
                value={member.name ?? ""}
                onChange={v => setField("name", v)}
                placeholder={`${member.firstName} ${member.lastName}`.trim() || "Zafora Leadership Team"}
                helper="This is the name that will appear on the website. Leave blank to auto-combine First + Last name."
              />

              {/* Title + Department */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title / Position" value={member.title ?? ""} onChange={v => setField("title", v)} placeholder="Executive Team" />
                <Field label="Department / Role" value={member.department ?? ""} onChange={v => setField("department", v)} placeholder="Leadership" />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f] flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#8a958f]" /> Location
                </label>
                <input
                  type="text"
                  value={member.location ?? ""}
                  onChange={e => setField("location", e.target.value)}
                  placeholder="Tampa, FL, USA"
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                />
              </div>

              {/* Bio */}
              <Field
                label="Bio / Description"
                value={member.bio ?? ""}
                onChange={v => setField("bio", v)}
                type="textarea"
                placeholder="Brief professional bio..."
                maxLength={280}
              />

              {/* Photo + LinkedIn + Email */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#f0ebe3]">
                <div>
                  <PhotoUploadField
                    folder={STORAGE_FOLDER.TEAM_PHOTOS}
                    label="Photo (optional)"
                    value={member.photo ?? ""}
                    onChange={v => setField("photo", v)}
                    placeholder="https://... or upload"
                    previewShape="circle"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#10231f] flex items-center gap-1.5">
                    <FaLinkedinIn size={13} className="text-[#0077b5]" /> LinkedIn URL (optional)
                  </label>
                  <input
                    type="text"
                    value={member.linkedin ?? ""}
                    onChange={e => setField("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#10231f] flex items-center gap-1.5">
                    <Mail size={13} className="text-[#173f35]" /> Email (optional)
                  </label>
                  <input
                    type="text"
                    value={member.email ?? ""}
                    onChange={e => setField("email", e.target.value)}
                    placeholder="name@zaforaholdings.com"
                    className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delete */}
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#10231f]">Delete Member</p>
                  <p className="text-xs text-[#8a958f] mt-0.5">Permanently removes this member from the site.</p>
                </div>
                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${confirmDelete ? "bg-red-500 text-white border-red-500" : "text-red-500 border-red-200 hover:bg-red-50"}`}
                >
                  <Trash2 size={14} />
                  {confirmDelete ? "Confirm Delete" : "Delete Member"}
                </button>
              </div>
              {confirmDelete && (
                <p className="text-xs text-red-500 mt-2">Click "Confirm Delete" again to permanently remove this member. This cannot be undone.</p>
              )}
            </div>
          </div>

          {/* Right: Display & Settings */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-5">
              <h2 className="font-bold text-[#10231f] text-base">Display & Settings</h2>
              <p className="text-xs text-[#8a958f] -mt-3">Control how this member appears on the website.</p>

              {/* Show on Website toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#10231f]">Show on Website</p>
                  <p className="text-[11px] text-[#8a958f] mt-0.5">{isPublished ? "Visible on the website" : "Hidden from website"}</p>
                </div>
                <button
                  onClick={() => setField("status", isPublished ? "draft" : "published")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublished ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isPublished ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f] block">Sort Order</label>
                <input
                  type="number"
                  min={1}
                  value={member.sortOrder ?? ""}
                  onChange={e => setField("sortOrder", Number(e.target.value))}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                />
                <p className="text-[11px] text-[#8a958f]">Lower numbers show first.</p>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f] block">Status</label>
                <select
                  value={member.status ?? "published"}
                  onChange={e => setField("status", e.target.value)}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white appearance-none cursor-pointer"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <p className="text-[11px] text-[#8a958f]">Draft members are not visible on the website.</p>
              </div>

              {/* Card Style */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f] block">Card Style</label>
                <select
                  value={member.cardStyle ?? "default"}
                  onChange={e => setField("cardStyle", e.target.value)}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white appearance-none cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              {/* Initials */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f] block">Initials</label>
                <input
                  type="text"
                  value={member.initials ?? ""}
                  onChange={e => setField("initials", e.target.value.toUpperCase().slice(0, 3))}
                  placeholder="ZH"
                  maxLength={3}
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white font-mono"
                />
                <p className="text-[11px] text-[#8a958f]">Shown when no photo is set.</p>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#8a958f]" />
                <h2 className="font-bold text-[#10231f] text-sm">Notes (internal)</h2>
              </div>
              <textarea
                rows={4}
                value={member.notes ?? ""}
                onChange={e => setField("notes", e.target.value)}
                placeholder="Add internal notes about this member..."
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white resize-none"
              />
              <p className="text-[11px] text-[#8a958f]">Only visible in admin panel.</p>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="mt-5 bg-[#f7f4ef] border border-[#e5ded3] rounded-xl px-5 py-3 flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-[#173f35] flex items-center justify-center shrink-0">
            <div className="h-1.5 w-1.5 rounded-full bg-[#173f35]" />
          </div>
          <p className="text-xs text-[#65736f]">
            Changes you save will go live on the website immediately. Set status to <strong>Draft</strong> to hide a member without deleting them.
          </p>
        </div>
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────────────────
  const sorted = [...team].map((m, i) => ({ ...m, _originalIdx: i }))
    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">Leadership Team</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">{team.length} member{team.length !== 1 ? "s" : ""} · sorted by Sort Order</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#173f35] text-[#173f35] font-semibold text-sm hover:bg-[#173f35]/5 transition-colors disabled:opacity-60"
          >
            {updateMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
            {saved ? "Saved" : "Save All"}
          </button>
          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] transition-colors"
          >
            <Plus size={14} /> Add Member
          </button>
        </div>
      </div>

      {team.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5ded3] py-16 text-center">
          <Users className="h-10 w-10 text-[#d0c9bf] mx-auto mb-4" />
          <p className="text-[#65736f] font-medium">No team members yet.</p>
          <button onClick={handleAddMember} className="mt-3 text-sm text-[#173f35] font-semibold hover:underline">
            Add your first member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((m) => {
            const idx = m._originalIdx;
            const isPublished = m.status !== "draft";
            const displayName = m.name || `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim() || m.initials || "Unnamed";
            return (
              <div key={idx} className="bg-white rounded-2xl border border-[#e5ded3] overflow-hidden hover:shadow-md transition-all group cursor-pointer" onClick={() => setSelectedIdx(idx)}>
                <div className="flex gap-4 p-5">
                  {/* Avatar */}
                  <div className="shrink-0">
                    {m.photo ? (
                      <img src={m.photo} alt={displayName} className="h-14 w-14 rounded-xl object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />
                    ) : (
                      <div className={`${TEAM_COLORS[idx % TEAM_COLORS.length]} h-14 w-14 rounded-xl flex items-center justify-center`}>
                        <span className="text-lg font-bold text-white opacity-90">{m.initials || "ZH"}</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#10231f] text-sm leading-tight">{displayName}</p>
                        <p className="text-xs text-[#c59b4a] font-semibold mt-0.5">{m.title}</p>
                        {m.department && <p className="text-[11px] text-[#8a958f] mt-0.5">{m.department}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPublished ? "bg-green-100 text-green-700" : "bg-[#e5ded3] text-[#8a958f]"}`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>
                        {isPublished ? <Eye size={12} className="text-green-600" /> : <EyeOff size={12} className="text-[#8a958f]" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8a958f]">
                      {m.location && <span>{m.location}</span>}
                      <span className="text-[#d0c9bf]">·</span>
                      <span>Order: {m.sortOrder ?? "—"}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-2.5 border-t border-[#f0ebe3] bg-[#faf8f5] flex items-center justify-between">
                  <p className="text-[11px] text-[#8a958f] truncate pr-4">{m.bio ? m.bio.slice(0, 60) + (m.bio.length > 60 ? "…" : "") : "No bio yet"}</p>
                  <span className="text-xs font-semibold text-[#173f35] group-hover:underline shrink-0">Edit</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info note */}
      <div className="bg-[#f7f4ef] border border-[#e5ded3] rounded-xl px-5 py-3 flex items-start gap-3">
        <div className="h-4 w-4 rounded-full border-2 border-[#173f35] flex items-center justify-center shrink-0 mt-0.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#173f35]" />
        </div>
        <p className="text-xs text-[#65736f]">
          Click any member card to edit their details. Use <strong>Sort Order</strong> to control display order on the website. Set status to <strong>Draft</strong> to hide without deleting. Section headline, sub-headline, and grid layout are editable in <strong>Site Settings › About Us</strong>.
        </p>
      </div>
    </div>
  );
}

