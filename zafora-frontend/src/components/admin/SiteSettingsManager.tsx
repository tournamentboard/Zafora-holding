import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@/src/lib/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check, Settings2, Globe, Layout, FileText, Info, Loader2, ExternalLink,
  BookOpen, Landmark, Shield, Send, Plus, Trash2, Image,
} from "lucide-react";
import AboutEditor from "./AboutEditor";
import ImagesEditor from "./ImagesEditor";

type Tab = "hero" | "footer" | "about" | "seo" | "services_page" | "government_page" | "submit_page" | "images";

const SEO_PAGES = [
  { key: "seo_home", label: "Home Page" },
  { key: "seo_about", label: "About Us Page" },
  { key: "seo_services", label: "Services Page" },
  { key: "seo_projects", label: "Projects Page" },
  { key: "seo_government", label: "Government Review" },
  { key: "seo_submit", label: "Submit a Request" },
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

function SaveBar({ onSave, isPending, saved, label }: { onSave: () => void; isPending: boolean; saved: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 justify-end pt-2">
      {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
      <button
        onClick={onSave}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
        {label}
      </button>
    </div>
  );
}

function useSavableSettings(settingKey: string) {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings(settingKey);
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try { setForm(JSON.parse(data.value)); } catch {}
    }
  }, [data?.value]);

  const save = (overrideForm?: any) => {
    updateMutation.mutate(
      { key: settingKey, data: { value: JSON.stringify(overrideForm ?? form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [`/api/content/settings/${settingKey}`] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    );
  };

  const set = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }));
  const setNested = (parent: string, key: string, val: any) =>
    setForm((f: any) => ({ ...f, [parent]: { ...(f[parent] ?? {}), [key]: val } }));

  return { form, setForm, set, setNested, save, isLoading, isPending: updateMutation.isPending, saved };
}

function HeroEditor() {
  const { form, set, save, isLoading, isPending, saved } = useSavableSettings("hero");

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Hero Section:</strong> Controls the large headline, subheadline, and buttons at the top of the homepage.
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FieldRow label="Badge Text" value={form.badge ?? ""} onChange={v => set("badge", v)} placeholder="Strategic Infrastructure & Consulting · Est. 2025" hint="Small text above the headline" />
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
      <div className="border-t border-[#e5ded3] pt-5">
        <h4 className="text-sm font-bold text-[#10231f] mb-4">Feature Badges & Panel</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Feature Badge 1" value={form.featureBadge1 ?? ""} onChange={v => set("featureBadge1", v)} placeholder="Government-ready documentation" />
          <FieldRow label="Feature Badge 2" value={form.featureBadge2 ?? ""} onChange={v => set("featureBadge2", v)} placeholder="PPP & funding advisory" />
          <FieldRow label="Feature Badge 3" value={form.featureBadge3 ?? ""} onChange={v => set("featureBadge3", v)} placeholder="Project lifecycle governance" />
          <FieldRow label="Panel Caption" value={form.panelCaption ?? ""} onChange={v => set("panelCaption", v)} placeholder="For governments, funders, and delivery partners." />
          <FieldRow label="Panel Stat Number" value={form.panelStat ?? ""} onChange={v => set("panelStat", v)} placeholder="1,240+" />
          <FieldRow label="Panel Stat Label" value={form.panelStatLabel ?? ""} onChange={v => set("panelStatLabel", v)} placeholder="Global inquiries" />
        </div>
      </div>
      <SaveBar onSave={() => save()} isPending={isPending} saved={saved} label="Save Hero Settings" />
    </div>
  );
}

function FooterEditor() {
  const { form, set, save, isLoading, isPending, saved } = useSavableSettings("footer");

  if (isLoading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-5">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Footer Content:</strong> Controls the company description, contact details, and copyright shown at the bottom of every page.
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FieldRow label="Company Description" value={form.description ?? ""} onChange={v => set("description", v)} type="textarea" placeholder="Brief company description shown in the footer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Email Address" value={form.email ?? ""} onChange={v => set("email", v)} placeholder="Office@zaforaholding.com" />
          <FieldRow label="Phone Number" value={form.phone ?? ""} onChange={v => set("phone", v)} placeholder="+1 (xxx) xxx-xxxx" />
        </div>
        <FieldRow label="Address (use new line for line 2)" value={form.address ?? ""} onChange={v => set("address", v)} type="textarea" placeholder={"3030 N Rocky Point Dr W, Suite 150\nTampa, FL 33607, USA"} />
        <FieldRow label="Copyright Year" value={form.copyright ?? ""} onChange={v => set("copyright", v)} placeholder="2025" hint="Used in '© 2025 Zafora Holding'" />
      </div>
      <SaveBar onSave={() => save()} isPending={isPending} saved={saved} label="Save Footer Settings" />
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
          <strong className="text-[#10231f]">SEO Settings:</strong> These fields control how your pages appear in Google search results and when shared on social media.
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
      <SaveBar onSave={handleSave} isPending={updateMutation.isPending || isLoading} saved={saved} label="Save SEO Settings" />
    </div>
  );
}

function ServicesPageEditor() {
  const { form, set, setNested, save, isLoading, isPending, saved } = useSavableSettings("services_page");

  const stats: Array<{value: string; label: string}> = form.stats ?? [
    { value: "$2.4B+", label: "Value Structured" },
    { value: "12+", label: "Countries" },
    { value: "45+", label: "Professionals" },
    { value: "100%", label: "Confidential" },
  ];

  const setStats = (updated: typeof stats) => set("stats", updated);

  if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Services Page:</strong> Edit the hero headline, stats strip, and bottom call-to-action on the Services page.
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Hero Section</h4>
        <FieldRow label="Badge Text" value={form.hero?.badge ?? ""} onChange={v => setNested("hero", "badge", v)} placeholder="Six Specialized Practices" />
        <FieldRow label="Headline" value={form.hero?.headline ?? ""} onChange={v => setNested("hero", "headline", v)} type="textarea" placeholder="Advisory built for Africa's complexity." />
        <FieldRow label="Subheadline" value={form.hero?.subheadline ?? ""} onChange={v => setNested("hero", "subheadline", v)} type="textarea" placeholder="Comprehensive structuring, funding, and delivery solutions..." />
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Stats Strip (4 items)</h4>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-[#f7f4ef] rounded-xl">
              <FieldRow label={`Stat ${i + 1} Value`} value={stat.value} onChange={v => setStats(stats.map((s, j) => j === i ? { ...s, value: v } : s))} placeholder="$2.4B+" />
              <FieldRow label={`Stat ${i + 1} Label`} value={stat.label} onChange={v => setStats(stats.map((s, j) => j === i ? { ...s, label: v } : s))} placeholder="Value Structured" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Bottom CTA</h4>
        <FieldRow label="CTA Headline" value={form.cta?.headline ?? ""} onChange={v => setNested("cta", "headline", v)} placeholder="Start with a confidential consultation." />
        <FieldRow label="CTA Subheadline" value={form.cta?.subheadline ?? ""} onChange={v => setNested("cta", "subheadline", v)} type="textarea" placeholder="Our advisors will assess your project..." />
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Button Text" value={form.cta?.btnText ?? ""} onChange={v => setNested("cta", "btnText", v)} placeholder="Start Conversation" />
          <FieldRow label="Button Link" value={form.cta?.btnLink ?? ""} onChange={v => setNested("cta", "btnLink", v)} placeholder="/submit" />
        </div>
      </div>

      <SaveBar onSave={() => save()} isPending={isPending} saved={saved} label="Save Services Page" />
    </div>
  );
}

function GovernmentPageEditor() {
  const { form, set, setNested, save, isLoading, isPending, saved } = useSavableSettings("government_page");

  const stats: Array<{value: string; label: string}> = form.stats ?? [
    { value: "12+", label: "Countries Served" },
    { value: "$2.4B+", label: "Projects Structured" },
    { value: "100%", label: "DFI-Compatible" },
    { value: "10+", label: "Years Experience" },
  ];
  const commitments: string[] = form.sidebar?.commitments ?? [
    "Full confidentiality on all submitted materials",
    "Response within 48 business hours",
    "No obligation preliminary assessment",
    "Senior advisor assignment from day one",
    "Alignment with African Union frameworks",
  ];

  const setStats = (updated: typeof stats) => set("stats", updated);
  const setCommitment = (i: number, val: string) => {
    const next = [...commitments];
    next[i] = val;
    set("sidebar", { ...(form.sidebar ?? {}), commitments: next });
  };
  const addCommitment = () => set("sidebar", { ...(form.sidebar ?? {}), commitments: [...commitments, ""] });
  const removeCommitment = (i: number) => set("sidebar", { ...(form.sidebar ?? {}), commitments: commitments.filter((_: string, j: number) => j !== i) });

  if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Government Review Center:</strong> Edit all text, stats, capability statements, and CTAs on the Government page.
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Hero Section</h4>
        <FieldRow label="Badge Text" value={form.hero?.badge ?? ""} onChange={v => setNested("hero", "badge", v)} placeholder="Government Portal" />
        <FieldRow label="Headline" value={form.hero?.headline ?? ""} onChange={v => setNested("hero", "headline", v)} type="textarea" placeholder="Government Review Center" />
        <FieldRow label="Subheadline" value={form.hero?.subheadline ?? ""} onChange={v => setNested("hero", "subheadline", v)} type="textarea" placeholder="Zafora partners with sovereign governments..." />
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Button 1 Text" value={form.hero?.btn1Text ?? ""} onChange={v => setNested("hero", "btn1Text", v)} placeholder="Request Capability Pack" />
          <FieldRow label="Button 1 Link" value={form.hero?.btn1Link ?? ""} onChange={v => setNested("hero", "btn1Link", v)} placeholder="/submit?type=government" />
          <FieldRow label="Button 2 Text" value={form.hero?.btn2Text ?? ""} onChange={v => setNested("hero", "btn2Text", v)} placeholder="Start a Project" />
          <FieldRow label="Button 2 Link" value={form.hero?.btn2Link ?? ""} onChange={v => setNested("hero", "btn2Link", v)} placeholder="/submit" />
        </div>
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Stats Strip (4 items)</h4>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-[#f7f4ef] rounded-xl">
              <FieldRow label={`Stat ${i + 1} Value`} value={stat.value} onChange={v => setStats(stats.map((s, j) => j === i ? { ...s, value: v } : s))} placeholder="12+" />
              <FieldRow label={`Stat ${i + 1} Label`} value={stat.label} onChange={v => setStats(stats.map((s, j) => j === i ? { ...s, label: v } : s))} placeholder="Countries Served" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Capability Statement</h4>
        <FieldRow label="Headline" value={form.capability?.headline ?? ""} onChange={v => setNested("capability", "headline", v)} type="textarea" placeholder="The critical bridge between state ambition and global capital." />
        <FieldRow label="Paragraph 1" value={form.capability?.paragraph1 ?? ""} onChange={v => setNested("capability", "paragraph1", v)} type="textarea" placeholder="As a premier African infrastructure advisory..." />
        <FieldRow label="Paragraph 2" value={form.capability?.paragraph2 ?? ""} onChange={v => setNested("capability", "paragraph2", v)} type="textarea" placeholder="Our approach ensures that projects..." />
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Sidebar CTA Card</h4>
        <FieldRow label="Card Title" value={form.sidebar?.ctaTitle ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), ctaTitle: v })} placeholder="Request Capability Pack" />
        <FieldRow label="Card Description" value={form.sidebar?.ctaDesc ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), ctaDesc: v })} type="textarea" placeholder="Government ministries and sovereign wealth funds can request..." />
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Button Text" value={form.sidebar?.ctaBtnText ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), ctaBtnText: v })} placeholder="Secure Access Request" />
          <FieldRow label="Button Link" value={form.sidebar?.ctaBtnLink ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), ctaBtnLink: v })} placeholder="/submit?type=government" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#10231f] uppercase tracking-wide">Commitments List</label>
            <button onClick={addCommitment} className="flex items-center gap-1 text-xs font-semibold text-[#173f35] hover:text-[#245d4e]">
              <Plus size={12} /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {commitments.map((c: string, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]"
                  value={c}
                  onChange={e => setCommitment(i, e.target.value)}
                  placeholder="e.g. Full confidentiality on all submitted materials"
                />
                <button onClick={() => removeCommitment(i)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Bottom CTA</h4>
        <FieldRow label="Headline" value={form.cta?.headline ?? ""} onChange={v => setNested("cta", "headline", v)} placeholder="Ready to advance your national agenda?" />
        <FieldRow label="Subheadline" value={form.cta?.subheadline ?? ""} onChange={v => setNested("cta", "subheadline", v)} type="textarea" placeholder="Begin with a confidential briefing..." />
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Button 1 Text" value={form.cta?.btn1Text ?? ""} onChange={v => setNested("cta", "btn1Text", v)} placeholder="Start a Confidential Briefing" />
          <FieldRow label="Button 1 Link" value={form.cta?.btn1Link ?? ""} onChange={v => setNested("cta", "btn1Link", v)} placeholder="/submit?type=government" />
          <FieldRow label="Button 2 Text" value={form.cta?.btn2Text ?? ""} onChange={v => setNested("cta", "btn2Text", v)} placeholder="View Active Projects" />
          <FieldRow label="Button 2 Link" value={form.cta?.btn2Link ?? ""} onChange={v => setNested("cta", "btn2Link", v)} placeholder="/projects" />
        </div>
      </div>

      <SaveBar onSave={() => save()} isPending={isPending} saved={saved} label="Save Government Page" />
    </div>
  );
}

function SubmitPageEditor() {
  const { form, set, setNested, save, isLoading, isPending, saved } = useSavableSettings("submit_page");

  const bullets: string[] = form.sidebar?.whyBullets ?? [
    "Senior advisor review within 48 hours",
    "No-obligation preliminary assessment",
    "Direct DFI and investor connections",
    "Full confidentiality guaranteed",
    "Active in 12+ African countries",
  ];

  const setBullet = (i: number, val: string) => {
    const next = [...bullets];
    next[i] = val;
    set("sidebar", { ...(form.sidebar ?? {}), whyBullets: next });
  };
  const addBullet = () => set("sidebar", { ...(form.sidebar ?? {}), whyBullets: [...bullets, ""] });
  const removeBullet = (i: number) => set("sidebar", { ...(form.sidebar ?? {}), whyBullets: bullets.filter((_: string, j: number) => j !== i) });

  if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 text-sm text-[#65736f]">
        <strong className="text-[#10231f]">Submit Request Page:</strong> Edit the page hero and the trust sidebar shown alongside the submission form.
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Hero Section</h4>
        <FieldRow label="Badge Text" value={form.hero?.badge ?? ""} onChange={v => setNested("hero", "badge", v)} placeholder="Start a Conversation" />
        <FieldRow label="Headline" value={form.hero?.headline ?? ""} onChange={v => setNested("hero", "headline", v)} type="textarea" placeholder="Submit Your Request" />
        <FieldRow label="Subheadline" value={form.hero?.subheadline ?? ""} onChange={v => setNested("hero", "subheadline", v)} type="textarea" placeholder="Initiate a dialogue with Zafora Holding..." />
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-[#10231f] text-sm">Trust Sidebar</h4>
        <FieldRow label="Section Title" value={form.sidebar?.whyTitle ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), whyTitle: v })} placeholder="Why submit to Zafora?" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#10231f] uppercase tracking-wide">Bullet Points</label>
            <button onClick={addBullet} className="flex items-center gap-1 text-xs font-semibold text-[#173f35] hover:text-[#245d4e]">
              <Plus size={12} /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {bullets.map((b: string, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]"
                  value={b}
                  onChange={e => setBullet(i, e.target.value)}
                  placeholder="e.g. Senior advisor review within 48 hours"
                />
                <button onClick={() => removeBullet(i)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <FieldRow label="Response Time Headline" value={form.sidebar?.responseTime ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), responseTime: v })} placeholder="48-hour response" />
        <FieldRow label="Response Time Description" value={form.sidebar?.responseDesc ?? ""} onChange={v => set("sidebar", { ...(form.sidebar ?? {}), responseDesc: v })} type="textarea" placeholder="A senior advisor will review your submission..." />
      </div>

      <SaveBar onSave={() => save()} isPending={isPending} saved={saved} label="Save Submit Page" />
    </div>
  );
}

const TAB_CONFIG = [
  { id: "hero" as Tab, label: "Hero Section", icon: Layout, desc: "Headline, buttons, badges" },
  { id: "about" as Tab, label: "About Us", icon: BookOpen, desc: "Story, mission & vision" },
  { id: "images" as Tab, label: "Site Images", icon: Image, desc: "All page photos" },
  { id: "footer" as Tab, label: "Footer", icon: FileText, desc: "Contact info & copyright" },
  { id: "services_page" as Tab, label: "Services Page", icon: Landmark, desc: "Hero, stats, CTA" },
  { id: "government_page" as Tab, label: "Government Page", icon: Shield, desc: "Hero, capabilities, CTA" },
  { id: "submit_page" as Tab, label: "Submit Page", icon: Send, desc: "Form page & sidebar" },
  { id: "seo" as Tab, label: "SEO", icon: Globe, desc: "Search engine settings" },
];

export default function SiteSettingsManager() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2"><Settings2 className="h-5 w-5 text-[#173f35]" /> Site Settings</h2>
        <p className="text-sm text-[#65736f] mt-0.5">Edit every page's content, footer details, and SEO settings — all from one place.</p>
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
        {activeTab === "images" && <ImagesEditor />}
        {activeTab === "footer" && <FooterEditor />}
        {activeTab === "services_page" && <ServicesPageEditor />}
        {activeTab === "government_page" && <GovernmentPageEditor />}
        {activeTab === "submit_page" && <SubmitPageEditor />}
        {activeTab === "seo" && <SeoEditor />}
      </div>

      <div className="bg-[#173f35]/5 border border-[#173f35]/15 rounded-2xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <div className="text-sm text-[#65736f]">
          <strong className="text-[#10231f]">Note:</strong> Changes take effect immediately on the live site. SEO settings affect search results over time as Google re-crawls your pages.
        </div>
      </div>
    </div>
  );
}
