import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Settings2, Globe, Layout, FileText, Info, Loader2, ExternalLink, BookOpen, Phone } from "lucide-react";

type Tab = "hero" | "footer" | "about" | "seo";

const SEO_PAGES = [
  { key: "seo_home", label: "Home Page" },
  { key: "seo_about", label: "About Us Page" },
  { key: "seo_services", label: "Services Page" },
  { key: "seo_projects", label: "Projects Page" },
];

function FieldRow({ label, value, onChange, type = "text", placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: "text" | "textarea" | "url"; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#10231f] mb-1 uppercase tracking-wide">{label}</label>
      {type === "textarea" ? (
        <textarea
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] resize-none"
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint && <p className="text-xs text-[#8a958f] mt-1">{hint}</p>}
    </div>
  );
}

function HeroEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("hero");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try { setForm(JSON.parse(data.value)); } catch {}
    }
  }, [data?.value]);

  const set = (key: string, val: string) => setForm((f: any) => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "hero", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["/api/content/settings/hero"] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    );
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Hero Section:</strong> This controls the large headline, subheadline, and buttons at the top of the homepage.
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FieldRow label="Badge Text" value={form.badge ?? ""} onChange={v => set("badge", v)} placeholder="e.g. Strategic Infrastructure & Consulting · Est. 2025" hint="Small text above the headline" />
        <FieldRow label="Headline" value={form.headline ?? ""} onChange={v => set("headline", v)} type="textarea" placeholder="Your main homepage headline" />
        <FieldRow label="Subheadline" value={form.subheadline ?? ""} onChange={v => set("subheadline", v)} type="textarea" placeholder="Supporting text below the headline" />
      </div>
      <div className="border-t border-[#e5ded3] pt-5">
        <h4 className="text-sm font-bold text-[#10231f] mb-4">Call-to-Action Buttons</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Primary Button Text" value={form.primaryBtnText ?? ""} onChange={v => set("primaryBtnText", v)} placeholder="e.g. Partner With Us" />
          <FieldRow label="Primary Button Link" value={form.primaryBtnLink ?? ""} onChange={v => set("primaryBtnLink", v)} placeholder="/submit" />
          <FieldRow label="Secondary Button Text" value={form.secondaryBtnText ?? ""} onChange={v => set("secondaryBtnText", v)} placeholder="e.g. View Pipeline" />
          <FieldRow label="Secondary Button Link" value={form.secondaryBtnLink ?? ""} onChange={v => set("secondaryBtnLink", v)} placeholder="/projects" />
          <FieldRow label="Third Button Text" value={form.thirdBtnText ?? ""} onChange={v => set("thirdBtnText", v)} placeholder="e.g. Our Services" />
          <FieldRow label="Third Button Link" value={form.thirdBtnLink ?? ""} onChange={v => set("thirdBtnLink", v)} placeholder="/services" />
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end">
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save Hero Settings
        </button>
      </div>
    </div>
  );
}

function FooterEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("footer");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try { setForm(JSON.parse(data.value)); } catch {}
    }
  }, [data?.value]);

  const set = (key: string, val: string) => setForm((f: any) => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "footer", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["/api/content/settings/footer"] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    );
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Footer Content:</strong> This controls the company description, contact details, and copyright shown at the bottom of every page.
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FieldRow label="Company Description" value={form.description ?? ""} onChange={v => set("description", v)} type="textarea" placeholder="Brief company description shown in the footer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Email Address" value={form.email ?? ""} onChange={v => set("email", v)} placeholder="Office@zaforaholding.com" />
          <FieldRow label="Phone Number" value={form.phone ?? ""} onChange={v => set("phone", v)} placeholder="+1 (xxx) xxx-xxxx" />
        </div>
        <FieldRow label="Address" value={form.address ?? ""} onChange={v => set("address", v)} placeholder="3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607, USA" />
        <FieldRow label="Copyright Year" value={form.copyright ?? ""} onChange={v => set("copyright", v)} placeholder="2025" hint="Used in '© 2025 Zafora Holding'" />
      </div>
      <div className="flex items-center gap-3 justify-end">
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save Footer Settings
        </button>
      </div>
    </div>
  );
}

function SeoEditor() {
  const [activePage, setActivePage] = useState("seo_home");
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings(activePage);
  const updateMutation = useUpdateSiteSettings();
  const [forms, setForms] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);

  const pageKey = activePage;
  const form = forms[pageKey] ?? {};

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setForms(f => ({ ...f, [pageKey]: parsed }));
      } catch {}
    }
  }, [data?.value, pageKey]);

  const set = (key: string, val: string) => setForms(f => ({ ...f, [pageKey]: { ...f[pageKey], [key]: val } }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: activePage, data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [`/api/content/settings/${activePage}`] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f] flex gap-3">
        <Globe className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#10231f]">SEO Settings:</strong> These fields control how your pages appear in Google search results and when shared on social media. Select a page below to edit its SEO.
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {SEO_PAGES.map(pg => (
          <button
            key={pg.key}
            onClick={() => { setActivePage(pg.key); setSaved(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activePage === pg.key ? "bg-[#173f35] text-white shadow-md" : "bg-white border border-[#e5ded3] text-[#65736f] hover:border-[#173f35] hover:text-[#10231f]"}`}
          >
            {pg.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>
      ) : (
        <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-[#10231f] text-sm">{SEO_PAGES.find(p => p.key === activePage)?.label}</h4>
          <FieldRow label="Page Title" value={form.title ?? ""} onChange={v => set("title", v)} placeholder="e.g. About Us — Zafora Holding" hint="Shown in browser tab and Google search. Keep under 60 characters." />
          <FieldRow label="Meta Description" value={form.description ?? ""} onChange={v => set("description", v)} type="textarea" placeholder="Short description of this page for search engines" hint="Shown under your link in Google. Keep under 160 characters." />
          <FieldRow label="Keywords" value={form.keywords ?? ""} onChange={v => set("keywords", v)} placeholder="infrastructure advisory, project finance, PPP" hint="Comma-separated keywords" />
          <div className="border-t border-[#e5ded3] pt-4">
            <h5 className="text-xs font-bold text-[#8a958f] uppercase tracking-wide mb-3 flex items-center gap-1.5"><ExternalLink size={12} /> Open Graph (Social Share)</h5>
            <div className="space-y-4">
              <FieldRow label="OG Title" value={form.ogTitle ?? ""} onChange={v => set("ogTitle", v)} placeholder="Short title for social shares" />
              <FieldRow label="OG Description" value={form.ogDescription ?? ""} onChange={v => set("ogDescription", v)} type="textarea" placeholder="Description shown when shared on LinkedIn, Twitter, etc." />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 justify-end">
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save SEO Settings
        </button>
      </div>
    </div>
  );
}

function AboutEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("about");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try { setForm(JSON.parse(data.value)); } catch {}
    }
  }, [data?.value]);

  const set = (key: string, val: string) => setForm((f: any) => ({ ...f, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "about", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["/api/content/settings/about"] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    );
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">About Us Page:</strong> Edit the company story, mission, vision, and contact details shown on the About page.
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#10231f]">Company Identity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldRow label="Company Name" value={form.companyName ?? ""} onChange={v => set("companyName", v)} placeholder="Zafora Holding" />
          <FieldRow label="Founded" value={form.founded ?? ""} onChange={v => set("founded", v)} placeholder="January 2025" />
          <FieldRow label="Headquarters" value={form.headquarters ?? ""} onChange={v => set("headquarters", v)} placeholder="Tampa, FL, USA" />
        </div>
        <FieldRow label="Story Headline" value={form.storyHeadline ?? ""} onChange={v => set("storyHeadline", v)} placeholder="Built to bridge the infrastructure gap." />
        <FieldRow label="Company Story" value={form.story ?? ""} onChange={v => set("story", v)} type="textarea" placeholder="The full company story paragraph shown at the top of the About page..." />
      </div>

      <div className="border-t border-[#e5ded3] pt-5 space-y-4">
        <h4 className="text-sm font-bold text-[#10231f]">Mission & Vision</h4>
        <FieldRow label="Mission Statement" value={form.mission ?? ""} onChange={v => set("mission", v)} type="textarea" placeholder="Our mission..." />
        <FieldRow label="Vision Statement" value={form.vision ?? ""} onChange={v => set("vision", v)} type="textarea" placeholder="Our vision..." />
      </div>

      <div className="border-t border-[#e5ded3] pt-5 space-y-4">
        <h4 className="text-sm font-bold text-[#10231f]">Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Email Address" value={form.email ?? ""} onChange={v => set("email", v)} placeholder="Office@zaforaholding.com" />
          <FieldRow label="Address" value={form.address ?? ""} onChange={v => set("address", v)} placeholder="3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607" />
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save About Settings
        </button>
      </div>
    </div>
  );
}

const TAB_CONFIG = [
  { id: "hero" as Tab, label: "Hero Section", icon: Layout, desc: "Headline, buttons, badges" },
  { id: "about" as Tab, label: "About Us", icon: BookOpen, desc: "Story, mission & vision" },
  { id: "footer" as Tab, label: "Footer", icon: FileText, desc: "Contact info & copyright" },
  { id: "seo" as Tab, label: "SEO", icon: Globe, desc: "Search engine settings" },
];

export default function SiteSettingsManager() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Settings2 className="h-5 w-5 text-[#173f35]" /> Site Settings</h2>
        <p className="text-sm text-[#65736f] mt-0.5">Edit your homepage content, about page, footer details, and SEO settings.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TAB_CONFIG.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-[#173f35] text-white shadow-md" : "bg-white border border-[#e5ded3] text-[#65736f] hover:border-[#173f35] hover:text-[#10231f]"}`}
            >
              <Icon size={16} />
              <div className="text-left hidden sm:block">
                <div>{tab.label}</div>
                <div className={`text-[10px] ${isActive ? "text-white/70" : "text-[#8a958f]"}`}>{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6">
        {activeTab === "hero" && <HeroEditor />}
        {activeTab === "about" && <AboutEditor />}
        {activeTab === "footer" && <FooterEditor />}
        {activeTab === "seo" && <SeoEditor />}
      </div>

      <div className="bg-[#173f35]/5 border border-[#173f35]/15 rounded-2xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <div className="text-sm text-[#65736f]">
          <strong className="text-[#10231f]">Note:</strong> Some site content (hero text, button labels) updates on the next page load. SEO settings affect search results over time as Google re-crawls your site.
        </div>
      </div>
    </div>
  );
}
