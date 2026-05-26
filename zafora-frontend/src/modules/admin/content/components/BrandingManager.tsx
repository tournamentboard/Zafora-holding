"use client";

import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings, siteSettingsKeys } from "../services/site-settings.service";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Palette, AlertCircle, ExternalLink } from "lucide-react";
import { PhotoUploadField } from "@/src/modules/admin/shared/components/PhotoUploadField";

interface BrandingConfig {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  footerColor: string;
  bodyFont: string;
  headingFont: string;
}

const DEFAULTS: BrandingConfig = {
  siteName: "Zafora Holding",
  tagline: "Infrastructure. Capital. Delivery.",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#173f35",
  accentColor: "#c59b4a",
  bgColor: "#f7f4ef",
  footerColor: "#10231f",
  bodyFont: "Inter",
  headingFont: "Inter",
};

const FONT_OPTIONS = [
  "Inter",
  "Plus Jakarta Sans",
  "DM Sans",
  "Libre Baskerville",
  "Playfair Display",
  "Lato",
  "Nunito",
  "Raleway",
];

function ColorSwatch({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#10231f] block">{label}</label>
      {hint && <p className="text-[11px] text-[#8a958f]">{hint}</p>}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg border-2 border-white shadow-md shrink-0 cursor-pointer relative overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 border border-[#e5ded3] rounded-lg px-3 py-1.5 text-sm font-mono text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function FieldRow({ label, value, onChange, placeholder, hint, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string; type?: "text" | "url";
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#10231f] block">{label}</label>
      {hint && <p className="text-[11px] text-[#8a958f]">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
      />
    </div>
  );
}

export default function BrandingManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("branding");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<BrandingConfig>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setForm({ ...DEFAULTS, ...parsed });
      } catch {}
    }
  }, [data?.value]);

  const set = (key: keyof BrandingConfig, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "branding", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: siteSettingsKeys.single("branding") });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  const handleReset = () => {
    if (!window.confirm("Reset all branding to defaults?")) return;
    setForm(DEFAULTS);
  };

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-[#173f35]" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2">
          <Palette className="h-5 w-5 text-[#173f35]" /> Branding Manager
        </h2>
        <p className="text-sm text-[#65736f] mt-0.5">Manage your site name, logo, colors, and typography. These settings power your site's visual identity.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Note:</strong> Color and font changes are saved here for reference. To apply them live, your developer will need to update the CSS variables in the frontend. Logo and site name changes take effect immediately.
        </div>
      </div>

      {/* Identity */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 space-y-5">
        <h3 className="font-bold text-[#10231f] text-sm flex items-center gap-2">Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Site Name" value={form.siteName} onChange={v => set("siteName", v)} placeholder="Zafora Holding" hint="Appears in browser tab and meta tags" />
          <FieldRow label="Tagline" value={form.tagline} onChange={v => set("tagline", v)} placeholder="Strategic Infrastructure Advisory" hint="Short description used in SEO and footer" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhotoUploadField
            label="Logo"
            value={form.logoUrl}
            onChange={v => set("logoUrl", v)}
            placeholder="https://example.com/logo.png"
            hint="PNG or SVG recommended"
          />
          <PhotoUploadField
            label="Favicon"
            value={form.faviconUrl}
            onChange={v => set("faviconUrl", v)}
            placeholder="https://example.com/favicon.png"
            hint="32×32 or 64×64 PNG"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 space-y-5">
        <h3 className="font-bold text-[#10231f] text-sm">Brand Colors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <ColorSwatch label="Primary (Green)" value={form.primaryColor} onChange={v => set("primaryColor", v)} hint="Buttons, nav, headings" />
          <ColorSwatch label="Accent (Gold)" value={form.accentColor} onChange={v => set("accentColor", v)} hint="Highlights, dividers" />
          <ColorSwatch label="Background" value={form.bgColor} onChange={v => set("bgColor", v)} hint="Page background" />
          <ColorSwatch label="Footer Dark" value={form.footerColor} onChange={v => set("footerColor", v)} hint="Footer background" />
        </div>
        <div className="flex gap-3 mt-2">
          {[form.primaryColor, form.accentColor, form.bgColor, form.footerColor].map((c, i) => (
            <div key={i} className="flex-1 h-10 rounded-xl shadow-sm border border-white/20" style={{ backgroundColor: c }} title={c} />
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#10231f] text-sm">Typography</h3>
            <p className="text-xs text-[#8a958f] mt-0.5">Select fonts for your site. These are stored as a reference for your developer to implement.</p>
          </div>
          <a href="https://fonts.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#173f35] hover:underline shrink-0">
            Browse Google Fonts <ExternalLink size={11} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#10231f] block">Body Font</label>
            <p className="text-[11px] text-[#8a958f]">Used for paragraphs and body text</p>
            <select
              value={form.bodyFont}
              onChange={e => set("bodyFont", e.target.value)}
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            >
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-base text-[#65736f] mt-2" style={{ fontFamily: form.bodyFont }}>
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#10231f] block">Heading Font</label>
            <p className="text-[11px] text-[#8a958f]">Used for page titles and section headings</p>
            <select
              value={form.headingFont}
              onChange={e => set("headingFont", e.target.value)}
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            >
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-2xl font-bold text-[#10231f] mt-2" style={{ fontFamily: form.headingFont }}>
              Infrastructure Advisory
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between">
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl border border-[#e5ded3] text-sm text-[#65736f] hover:border-[#173f35] transition-colors"
        >
          Reset to Defaults
        </button>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved</span>}
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
          >
            {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Save Branding
          </button>
        </div>
      </div>
    </div>
  );
}

