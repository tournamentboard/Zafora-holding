"use client";

import { useState, useEffect, useRef } from "react";
import { useImageUpload } from "@/src/hooks/use-image-upload";
import { useGetSiteSettings, useUpdateSiteSettings, siteSettingsKeys } from "../services/site-settings.service";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Info, ChevronDown, ChevronRight, Home, Settings2, Shield } from "lucide-react";
import { STORAGE_FOLDER } from "@/src/lib/constants";
import type { StorageFolder } from "@/src/lib/constants";

const IMAGE_DEFAULTS = {
  home: {
    heroPanel: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    band1: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80",
    band2: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    band3: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    pillar1: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=600&q=80",
    pillar2: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    pillar3: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    engage1: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    engage2: "https://images.unsplash.com/photo-1616093875201-cc5a1b4e2a5d?auto=format&fit=crop&w=600&q=80",
    engage3: "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=600&q=80",
    collage1: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80",
    collage2: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
    collage3: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&q=80",
    collage4: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
  },
  services: {
    mosaicLeft: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
    mosaicRight: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=600&q=80",
  },
  government: {
    heroImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80",
    mainLeft: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80",
    mainRight: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80",
  },
};

function deepMerge(base: any, override: any): any {
  if (!override || typeof override !== "object") return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (typeof override[key] === "object" && !Array.isArray(override[key]) && typeof base[key] === "object") {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

function ImageField({ folder, label, hint, value, onChange }: {
  folder: StorageFolder; label: string; hint?: string; value: string; onChange: (v: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useImageUpload({
    folder,
    onSuccess: (result) => onChange(result.publicUrl),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#10231f] block">{label}</label>
      {hint && <p className="text-[11px] text-[#8a958f]">{hint}</p>}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="shrink-0 px-3 py-2.5 text-xs font-semibold rounded-xl border border-[#173f35] text-[#173f35] hover:bg-[#173f35] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          title="Upload an image from your device"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        <div className="w-14 h-10 rounded-xl overflow-hidden border border-[#e5ded3] shrink-0 bg-[#f7f4ef] flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
            />
          ) : (
            <span className="text-[#c5bdb3] text-[10px] font-semibold text-center leading-tight px-1">No img</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#e5ded3] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#f7f4ef] hover:bg-[#efe3cf] transition-colors"
      >
        <div className="flex items-center gap-3 font-bold text-[#10231f] text-sm">
          <span className="text-[#173f35]">{icon}</span>
          {title}
        </div>
        {open ? <ChevronDown size={16} className="text-[#8a958f]" /> : <ChevronRight size={16} className="text-[#8a958f]" />}
      </button>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  );
}

export default function ImagesEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("site_images");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>(IMAGE_DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setForm(deepMerge(IMAGE_DEFAULTS, parsed));
      } catch {}
    }
  }, [data?.value]);

  const setImg = (section: string, key: string, val: string) =>
    setForm((f: any) => ({ ...f, [section]: { ...f[section], [key]: val } }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "site_images", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: siteSettingsKeys.single("site_images") });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  if (isLoading) return (
    <div className="h-48 flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-[#173f35]" />
    </div>
  );

  const f = form;

  return (
    <div className="space-y-4">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <p className="text-sm text-[#65736f]">
          <strong className="text-[#10231f]">Every site image is managed here.</strong> Paste any public image URL — from your hosting, Google Drive (public share link), or any CDN. A preview thumbnail appears on the right. For best results, use landscape images at least 1200px wide. Leadership team photos are managed in the About Us tab.
        </p>
      </div>

      <SectionBlock title="Home Page Images" icon={<Home size={16} />} defaultOpen>
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide mb-3">Hero Section</p>
            <ImageField
              folder={STORAGE_FOLDER.SITE_IMAGES_HOME}
              label="Hero Right Panel Photo"
              hint="The photo inside the dark green card on the right of the hero"
              value={f.home?.heroPanel ?? ""}
              onChange={v => setImg("home", "heroPanel", v)}
            />
          </div>

          <div className="border-t border-[#f0e8dd] pt-4">
            <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide mb-3">Image Band (3 photos below the ticker strip)</p>
            <div className="space-y-3">
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Band Photo 1 — Government Advisory" value={f.home?.band1 ?? ""} onChange={v => setImg("home", "band1", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Band Photo 2 — Project Finance" value={f.home?.band2 ?? ""} onChange={v => setImg("home", "band2", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Band Photo 3 — Execution Oversight" value={f.home?.band3 ?? ""} onChange={v => setImg("home", "band3", v)} />
            </div>
          </div>

          <div className="border-t border-[#f0e8dd] pt-4">
            <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide mb-3">Three Pillars Section (Governments · Investors · Contractors)</p>
            <div className="space-y-3">
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Pillar Card 1 — Governments" value={f.home?.pillar1 ?? ""} onChange={v => setImg("home", "pillar1", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Pillar Card 2 — Investors & DFIs" value={f.home?.pillar2 ?? ""} onChange={v => setImg("home", "pillar2", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Pillar Card 3 — Contractors & EPC" value={f.home?.pillar3 ?? ""} onChange={v => setImg("home", "pillar3", v)} />
            </div>
          </div>

          <div className="border-t border-[#f0e8dd] pt-4">
            <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide mb-3">Engagement Paths (How Would You Like to Engage?)</p>
            <div className="space-y-3">
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Engage Card 1 — For Governments" value={f.home?.engage1 ?? ""} onChange={v => setImg("home", "engage1", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Engage Card 2 — For Investors" value={f.home?.engage2 ?? ""} onChange={v => setImg("home", "engage2", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Engage Card 3 — For Contractors" value={f.home?.engage3 ?? ""} onChange={v => setImg("home", "engage3", v)} />
            </div>
          </div>

          <div className="border-t border-[#f0e8dd] pt-4">
            <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide mb-3">About Teaser — 4-Photo Collage (right side)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Collage Photo 1 (tall, left column)" value={f.home?.collage1 ?? ""} onChange={v => setImg("home", "collage1", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Collage Photo 2 (short, right top)" value={f.home?.collage2 ?? ""} onChange={v => setImg("home", "collage2", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Collage Photo 3 (short, right bottom)" value={f.home?.collage3 ?? ""} onChange={v => setImg("home", "collage3", v)} />
              <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_HOME} label="Collage Photo 4 (tall, right column)" value={f.home?.collage4 ?? ""} onChange={v => setImg("home", "collage4", v)} />
            </div>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock title="Services Page Images" icon={<Settings2 size={16} />}>
        <p className="text-xs text-[#8a958f]">The mosaic photo grid shown in the Services page hero. Individual service card images are set per-service in the Services admin section.</p>
        <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_SERVICES} label="Mosaic Left — Tall Photo" value={f.services?.mosaicLeft ?? ""} onChange={v => setImg("services", "mosaicLeft", v)} />
        <ImageField folder={STORAGE_FOLDER.SITE_IMAGES_SERVICES} label="Mosaic Right — Top Photo" value={f.services?.mosaicRight ?? ""} onChange={v => setImg("services", "mosaicRight", v)} />
      </SectionBlock>

      <SectionBlock title="Government Review Center Images" icon={<Shield size={16} />}>
        <ImageField
          folder={STORAGE_FOLDER.SITE_IMAGES_GOVERNMENT}
          label="Full-Width Hero Banner"
          hint="The large panoramic image behind the page headline"
          value={f.government?.heroImage ?? ""}
          onChange={v => setImg("government", "heroImage", v)}
        />
        <ImageField
          folder={STORAGE_FOLDER.SITE_IMAGES_GOVERNMENT}
          label="Content Section — Left Photo"
          hint="Left image in the two-photo grid mid-page"
          value={f.government?.mainLeft ?? ""}
          onChange={v => setImg("government", "mainLeft", v)}
        />
        <ImageField
          folder={STORAGE_FOLDER.SITE_IMAGES_GOVERNMENT}
          label="Content Section — Right Photo"
          hint="Right image in the two-photo grid mid-page"
          value={f.government?.mainRight ?? ""}
          onChange={v => setImg("government", "mainRight", v)}
        />
      </SectionBlock>

      <div className="flex items-center gap-3 justify-end pt-2 sticky bottom-0 bg-white border-t border-[#e5ded3] p-4 -mx-6 -mb-6 rounded-b-2xl">
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            <Check size={14} /> Saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save All Image Changes
        </button>
      </div>
    </div>
  );
}

