import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check, Loader2, Info, ChevronDown, ChevronRight,
  Users, Target, Eye, EyeOff, Globe, ShieldCheck, TrendingUp,
  Award, Handshake, MapPin, Plus, Trash2, ChevronUp, Linkedin, Mail,
} from "lucide-react";
import { PhotoUploadField } from "./PhotoUploadField";

type Section = "hero" | "stats" | "identity" | "whoweare" | "mvp" | "values" | "team" | "timeline" | "cta";

const AVAILABLE_ICONS = [
  "Zap", "Droplets", "Truck", "Stethoscope", "Building2", "Landmark",
  "Globe", "ShieldCheck", "TrendingUp", "Users",
];

const ABOUT_DEFAULTS = {
  sectors: [
    { icon: "Zap", label: "Energy" },
    { icon: "Droplets", label: "Water" },
    { icon: "Truck", label: "Transport" },
    { icon: "Stethoscope", label: "Healthcare" },
    { icon: "Building2", label: "Housing" },
    { icon: "Landmark", label: "Digital" },
  ],
  sectorHeadline: "Sectors we operate in",
  sectorSubheadline: "Our practice spans critical infrastructure development across global markets.",
  hero: {
    headline: "Bridging global opportunities through infrastructure intelligence.",
    subheadline: "Zafora Holding is a U.S.-based strategic infrastructure, investment, and consulting company connecting governments, enterprises, investors, and contractors to scalable opportunities across global markets.",
    badge: "About Zafora Holding",
    btn1Text: "Work With Us", btn1Link: "/submit",
    btn2Text: "View Our Pipeline", btn2Link: "/projects",
  },
  stats: [
    { value: "2025", label: "Founded — Tampa, FL, USA" },
    { value: "5+", label: "Global Market Regions" },
    { value: "6", label: "Core Focus Areas" },
    { value: "Global", label: "Strategic Partnerships" },
  ],
  identity: {
    quote: "We bridge global opportunities through infrastructure intelligence, strategic partnerships, and technology-driven solutions — delivering long-term impact across emerging and developed markets.",
    quoteAttribution: "— Zafora Holding",
    founded: "January 2025",
    headquarters: "Tampa, FL, USA",
    contact: "Office@zaforaholding.com",
    markets: "Africa · Americas · Caribbean",
  },
  whoWeAre: {
    headline: "A company built for global infrastructure opportunities.",
    paragraph1: "Founded in January 2025 and headquartered in Tampa, Florida, Zafora Holding was built with a vision to bridge global opportunities through infrastructure intelligence, strategic partnerships, technology-driven solutions, and international business development.",
    paragraph2: "We support public and private sector initiatives by connecting innovation, operational strategy, and scalable development opportunities across emerging and developed markets.",
    paragraph3: "Our organization is built around the belief that the future of infrastructure, technology, logistics, energy, communications, and smart development requires trusted partnerships, transparency, strategic execution, and long-term vision.",
    bullet1: "Strategic infrastructure development & modernization",
    bullet2: "Government & enterprise operational solutions",
    bullet3: "International partnerships across global markets",
    bullet4: "Technology-enabled development strategies",
  },
  mvp: {
    sectionHeadline: "Mission, Vision & Purpose",
    sectionSubheadline: "Everything we do flows from a single conviction: infrastructure development must be driven by trust, innovation, and execution excellence.",
    mission: "To create strategic global partnerships and deliver innovative infrastructure, technology, and development solutions that drive sustainable growth, operational efficiency, and long-term economic impact.",
    vision: "To become a globally recognized infrastructure and strategic solutions company that bridges international opportunities, emerging technologies, and large-scale development initiatives through trust, innovation, and execution excellence.",
    purpose: "To demonstrate that infrastructure development — across any market — can be transparent, scalable, and community-positive, creating a trusted template for responsible global development.",
  },
  values: [
    { title: "Integrity First", desc: "Every engagement is conducted with full transparency, ethical rigor, and accountability to all stakeholders — governments, investors, and communities alike." },
    { title: "Pan-African Vision", desc: "We operate across borders with a deep understanding of Africa's political, economic, and regulatory landscapes — no market is too complex." },
    { title: "Partnership Model", desc: "We don't just advise — we co-create. Zafora sits at the table as a long-term partner, sharing risk and aligning incentives with every client." },
    { title: "Bankable Outcomes", desc: "We structure projects to meet international finance standards — making them attractive to multilaterals, DFIs, and institutional capital." },
    { title: "Execution Focus", desc: "Advisory without delivery is incomplete. We track projects from concept to commissioning, ensuring commitments become reality on the ground." },
    { title: "Excellence in Practice", desc: "We apply best-in-class global standards to every project — from technical due diligence to procurement frameworks and impact measurement." },
  ],
  teamHeadline: "The team behind the work",
  teamSubheadline: "Experienced operators who have led projects, not just advised on them.",
  teamLayout: "4",
  team: [
    { firstName: "James", lastName: "Okafor", name: "", title: "Founder & Chief Executive Officer", department: "Executive Leadership", bio: "Infrastructure strategist with 20+ years bridging African sovereign governments and international capital markets. Leads Zafora's strategic vision, senior government relationships, and institutional partnerships across Sub-Saharan Africa.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 1, status: "published" },
    { firstName: "Amara", lastName: "Diallo", name: "", title: "Director of Infrastructure Advisory", department: "Advisory", bio: "Former senior consultant to the African Development Bank, specializing in PPP frameworks, DFI engagement, and sovereign project finance. Advises government clients on risk mitigation, project structuring, and multilateral capital mobilization.", location: "Washington, D.C., USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 2, status: "published" },
    { firstName: "Sarah", lastName: "Mitchell", name: "", title: "Director of Operations", department: "Operations", bio: "Operations strategist with a decade managing complex, multi-stakeholder infrastructure programs across East Africa. Expert in compliance frameworks, project governance, and end-to-end delivery management for large-scale development initiatives.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 3, status: "published" },
    { firstName: "Emmanuel", lastName: "Kwesi", name: "", title: "Head of Global Partnerships", department: "Partnerships", bio: "Relationship architect connecting institutional investors, government agencies, and engineering contractors to bankable African infrastructure opportunities. Deep network across the Americas, Europe, and Sub-Saharan Africa.", location: "New York, NY, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 4, status: "published" },
    { firstName: "David", lastName: "Mensah", name: "", title: "Chief Financial Officer", department: "Finance", bio: "Infrastructure finance executive with deep expertise in project finance structuring, DFI co-financing, and sovereign debt instruments. Oversees Zafora's financial strategy, treasury operations, and capital mobilization across all active mandates.", location: "Tampa, FL, USA", photo: "", linkedin: "", email: "", visible: true, sortOrder: 5, status: "published" },
  ],
  timeline: [
    { year: "2025", event: "Zafora Holding established in Tampa, Florida. The company began developing its operational framework, brand identity, strategic partnerships, and long-term infrastructure vision focused on government, enterprise, and development opportunities." },
    { year: "Mid 2025", event: "Initiated relationship-building efforts and market research focused on infrastructure, technology, and development opportunities across Africa, the Caribbean, and emerging international markets. Expanded focus toward infrastructure intelligence, smart development, and strategic consulting." },
    { year: "Late 2025", event: "Began developing strategic initiatives involving infrastructure visibility systems, smart operational ecosystems, technology-enabled development strategies, and international business partnerships." },
    { year: "2026", event: "Continuing to build strategic relationships and positioning for international opportunities involving infrastructure, technology, consulting, operational transformation, and global development initiatives across emerging and established markets." },
  ],
  cta: {
    headline: "Ready to bring your project to life?",
    subheadline: "Whether you're a government, investor, or contractor — we'd like to hear about your infrastructure ambitions.",
    btn1Text: "Start a Conversation", btn1Link: "/submit",
    btn2Text: "Explore the Pipeline", btn2Link: "/projects",
  },
};

function Field({ label, value, onChange, type = "text", placeholder, maxLength }: {
  label: string; value: string; onChange: (v: string) => void; type?: "text" | "textarea"; placeholder?: string; maxLength?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#10231f] block">{label}</label>
      {type === "textarea" ? (
        <div>
          <textarea
            rows={3}
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

export default function AboutEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("about");
  const updateMutation = useUpdateSiteSettings();
  const [form, setForm] = useState<any>(ABOUT_DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setForm((prev: any) => deepMerge(prev, parsed));
      } catch {}
    }
  }, [data?.value]);

  function deepMerge(base: any, override: any): any {
    if (!override || typeof override !== "object") return base;
    const result = { ...base };
    for (const key of Object.keys(override)) {
      if (Array.isArray(override[key])) {
        result[key] = override[key];
      } else if (typeof override[key] === "object" && typeof base[key] === "object" && !Array.isArray(base[key])) {
        result[key] = deepMerge(base[key], override[key]);
      } else {
        result[key] = override[key];
      }
    }
    return result;
  }

  const setNested = (section: string, key: string, val: string) =>
    setForm((f: any) => ({ ...f, [section]: { ...f[section], [key]: val } }));

  const setArrayItem = (section: string, idx: number, key: string, val: any) =>
    setForm((f: any) => {
      const arr = [...(f[section] ?? [])];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...f, [section]: arr };
    });

  const addArrayItem = (section: string, template: object) =>
    setForm((f: any) => ({ ...f, [section]: [...(f[section] ?? []), { ...template }] }));

  const removeArrayItem = (section: string, idx: number) =>
    setForm((f: any) => ({ ...f, [section]: (f[section] ?? []).filter((_: any, i: number) => i !== idx) }));

  const moveArrayItem = (section: string, idx: number, dir: -1 | 1) =>
    setForm((f: any) => {
      const arr = [...(f[section] ?? [])];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return f;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...f, [section]: arr };
    });

  const handleSave = () => {
    updateMutation.mutate(
      { key: "about", data: { value: JSON.stringify(form) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["/api/content/settings/about"] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;

  const f = form;

  return (
    <div className="space-y-4">
      <div className="bg-[#efe3cf]/40 border border-[#e5ded3] rounded-xl p-4 flex gap-3">
        <Info className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <p className="text-sm text-[#65736f]">
          <strong className="text-[#10231f]">Every section of the About page is editable here.</strong> Click any section below to expand it. Save once when you're done — all sections save together.
        </p>
      </div>

      {/* Hero */}
      <SectionBlock title="Hero Section" icon={<Globe size={16} />} defaultOpen>
        <Field label="Headline" value={f.hero?.headline ?? ""} onChange={v => setNested("hero", "headline", v)} type="textarea" />
        <Field label="Sub-headline" value={f.hero?.subheadline ?? ""} onChange={v => setNested("hero", "subheadline", v)} type="textarea" />
        <Field label="Badge Text" value={f.hero?.badge ?? ""} onChange={v => setNested("hero", "badge", v)} placeholder="About Zafora Holding" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Button 1 Text" value={f.hero?.btn1Text ?? ""} onChange={v => setNested("hero", "btn1Text", v)} placeholder="Work With Us" />
          <Field label="Button 1 Link" value={f.hero?.btn1Link ?? ""} onChange={v => setNested("hero", "btn1Link", v)} placeholder="/submit" />
          <Field label="Button 2 Text" value={f.hero?.btn2Text ?? ""} onChange={v => setNested("hero", "btn2Text", v)} placeholder="View Our Pipeline" />
          <Field label="Button 2 Link" value={f.hero?.btn2Link ?? ""} onChange={v => setNested("hero", "btn2Link", v)} placeholder="/projects" />
        </div>
      </SectionBlock>

      {/* Stats */}
      <SectionBlock title="Hero Stats (4 boxes)" icon={<TrendingUp size={16} />}>
        <p className="text-xs text-[#8a958f]">The four stat boxes shown in the hero section. Edit value and label for each.</p>
        {(f.stats ?? []).map((s: any, i: number) => (
          <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-[#f7f4ef] rounded-xl">
            <Field label={`Stat ${i + 1} Value`} value={s.value ?? ""} onChange={v => setArrayItem("stats", i, "value", v)} placeholder="2025" />
            <Field label={`Stat ${i + 1} Label`} value={s.label ?? ""} onChange={v => setArrayItem("stats", i, "label", v)} placeholder="Founded — Tampa, FL, USA" />
          </div>
        ))}
      </SectionBlock>

      {/* Identity Card */}
      <SectionBlock title="Identity Card (dark green panel)" icon={<ShieldCheck size={16} />}>
        <p className="text-xs text-[#8a958f]">The dark green panel shown beside the "Who We Are" text.</p>
        <Field label="Company Quote" value={f.identity?.quote ?? ""} onChange={v => setNested("identity", "quote", v)} type="textarea" />
        <Field label="Quote Attribution" value={f.identity?.quoteAttribution ?? ""} onChange={v => setNested("identity", "quoteAttribution", v)} placeholder="— Zafora Holding" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Founded" value={f.identity?.founded ?? ""} onChange={v => setNested("identity", "founded", v)} placeholder="January 2025" />
          <Field label="Headquarters" value={f.identity?.headquarters ?? ""} onChange={v => setNested("identity", "headquarters", v)} placeholder="Tampa, FL, USA" />
          <Field label="Contact Email" value={f.identity?.contact ?? ""} onChange={v => setNested("identity", "contact", v)} placeholder="Office@zaforaholding.com" />
          <Field label="Markets" value={f.identity?.markets ?? ""} onChange={v => setNested("identity", "markets", v)} placeholder="Africa · Americas · Caribbean" />
        </div>
      </SectionBlock>

      {/* Who We Are */}
      <SectionBlock title="Who We Are" icon={<Users size={16} />}>
        <Field label="Section Headline" value={f.whoWeAre?.headline ?? ""} onChange={v => setNested("whoWeAre", "headline", v)} />
        <Field label="Paragraph 1" value={f.whoWeAre?.paragraph1 ?? ""} onChange={v => setNested("whoWeAre", "paragraph1", v)} type="textarea" />
        <Field label="Paragraph 2" value={f.whoWeAre?.paragraph2 ?? ""} onChange={v => setNested("whoWeAre", "paragraph2", v)} type="textarea" />
        <Field label="Paragraph 3" value={f.whoWeAre?.paragraph3 ?? ""} onChange={v => setNested("whoWeAre", "paragraph3", v)} type="textarea" />
        <div className="border-t border-[#e5ded3] pt-4 space-y-3">
          <p className="text-xs font-bold text-[#10231f]">Bullet Points (4)</p>
          {["bullet1", "bullet2", "bullet3", "bullet4"].map((k, i) => (
            <Field key={k} label={`Bullet ${i + 1}`} value={f.whoWeAre?.[k] ?? ""} onChange={v => setNested("whoWeAre", k, v)} />
          ))}
        </div>
      </SectionBlock>

      {/* Mission, Vision, Purpose */}
      <SectionBlock title="Mission, Vision & Purpose" icon={<Target size={16} />}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Section Headline" value={f.mvp?.sectionHeadline ?? ""} onChange={v => setNested("mvp", "sectionHeadline", v)} />
          <Field label="Section Sub-headline" value={f.mvp?.sectionSubheadline ?? ""} onChange={v => setNested("mvp", "sectionSubheadline", v)} />
        </div>
        <Field label="Our Mission" value={f.mvp?.mission ?? ""} onChange={v => setNested("mvp", "mission", v)} type="textarea" />
        <Field label="Our Vision" value={f.mvp?.vision ?? ""} onChange={v => setNested("mvp", "vision", v)} type="textarea" />
        <Field label="Our Purpose" value={f.mvp?.purpose ?? ""} onChange={v => setNested("mvp", "purpose", v)} type="textarea" />
      </SectionBlock>

      {/* Values */}
      <SectionBlock title="Our Values (6 cards)" icon={<Award size={16} />}>
        <p className="text-xs text-[#8a958f]">Edit the title and description for each of the six core values. Icons are fixed.</p>
        <div className="space-y-3">
          {(f.values ?? []).map((v: any, i: number) => (
            <div key={i} className="p-4 bg-[#f7f4ef] rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#173f35] bg-[#173f35]/10 px-2 py-0.5 rounded-full">Value {i + 1}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Title" value={v.title ?? ""} onChange={val => setArrayItem("values", i, "title", val)} />
                <div className="md:col-span-2">
                  <Field label="Description" value={v.desc ?? ""} onChange={val => setArrayItem("values", i, "desc", val)} type="textarea" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Team */}
      <SectionBlock title="Leadership Team" icon={<Users size={16} />}>
        {/* Section-level settings */}
        <div className="p-4 bg-[#f7f4ef] rounded-xl space-y-3">
          <p className="text-xs font-bold text-[#10231f] uppercase tracking-wide">Section Settings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Section Headline" value={f.teamHeadline ?? ""} onChange={v => setForm((p: any) => ({ ...p, teamHeadline: v }))} placeholder="The team behind the work" />
            <Field label="Section Sub-headline" value={f.teamSubheadline ?? ""} onChange={v => setForm((p: any) => ({ ...p, teamSubheadline: v }))} placeholder="Experienced operators..." />
          </div>
          <div>
            <label className="text-xs font-bold text-[#10231f] block mb-1.5">Layout Style</label>
            <div className="flex gap-2">
              {[
                { val: "2", label: "2 per row" },
                { val: "3", label: "3 per row" },
                { val: "4", label: "4 per row" },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setForm((p: any) => ({ ...p, teamLayout: opt.val }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${(f.teamLayout ?? "4") === opt.val ? "bg-[#173f35] text-white border-[#173f35]" : "bg-white text-[#65736f] border-[#e5ded3] hover:border-[#173f35]/40"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {(f.team ?? []).map((member: any, i: number) => {
            const isHidden = member.visible === false;
            return (
              <div key={i} className={`rounded-xl border transition-colors ${isHidden ? "border-[#e5ded3] bg-[#fafaf8] opacity-60" : "border-[#e5ded3] bg-[#f7f4ef]"} p-4 space-y-3`}>
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#173f35] bg-[#173f35]/10 px-2 py-0.5 rounded-full">
                      Member {i + 1}
                    </span>
                    {isHidden && (
                      <span className="text-[10px] font-semibold text-[#8a958f] bg-[#e5ded3] px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      title="Move up"
                      onClick={() => moveArrayItem("team", i, -1)}
                      disabled={i === 0}
                      className="p-1.5 rounded-lg hover:bg-[#e5ded3] text-[#8a958f] disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      title="Move down"
                      onClick={() => moveArrayItem("team", i, 1)}
                      disabled={i === (f.team ?? []).length - 1}
                      className="p-1.5 rounded-lg hover:bg-[#e5ded3] text-[#8a958f] disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button
                      title={isHidden ? "Show on site" : "Hide from site"}
                      onClick={() => setArrayItem("team", i, "visible", !member.visible)}
                      className={`p-1.5 rounded-lg transition-colors ${isHidden ? "hover:bg-green-50 text-[#8a958f]" : "hover:bg-[#e5ded3] text-[#173f35]"}`}
                    >
                      {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    {(f.team ?? []).length > 1 && (
                      <button onClick={() => removeArrayItem("team", i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 1: core identity */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Field label="First Name" value={member.firstName ?? ""} onChange={v => setArrayItem("team", i, "firstName", v)} placeholder="John" />
                  <Field label="Last Name" value={member.lastName ?? ""} onChange={v => setArrayItem("team", i, "lastName", v)} placeholder="Smith" />
                  <Field label="Title / Position" value={member.title ?? ""} onChange={v => setArrayItem("team", i, "title", v)} placeholder="Executive Team" />
                  <Field label="Department / Role" value={member.department ?? ""} onChange={v => setArrayItem("team", i, "department", v)} placeholder="Leadership" />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Location" value={member.location ?? ""} onChange={v => setArrayItem("team", i, "location", v)} placeholder="Tampa, FL, USA" />
                </div>

                {/* Bio with char counter */}
                <Field label="Bio / Description" value={member.bio ?? ""} onChange={v => setArrayItem("team", i, "bio", v)} type="textarea" maxLength={280} />

                {/* Photo */}
                <PhotoUploadField
                  label="Photo (optional)"
                  value={member.photo ?? ""}
                  onChange={v => setArrayItem("team", i, "photo", v)}
                  placeholder="Paste URL or upload — leave blank to use initials"
                />

                {/* LinkedIn + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#10231f] flex items-center gap-1.5 block">
                      <Linkedin size={11} className="text-[#0077b5]" /> LinkedIn URL (optional)
                    </label>
                    <input
                      type="text"
                      value={member.linkedin ?? ""}
                      onChange={e => setArrayItem("team", i, "linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#10231f] flex items-center gap-1.5 block">
                      <Mail size={11} className="text-[#173f35]" /> Email (optional)
                    </label>
                    <input
                      type="text"
                      value={member.email ?? ""}
                      onChange={e => setArrayItem("team", i, "email", e.target.value)}
                      placeholder="name@zaforaholding.com"
                      className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {(f.team ?? []).length < 12 && (
            <button
              onClick={() => addArrayItem("team", { firstName: "", lastName: "", title: "", department: "", bio: "", location: "", photo: "", linkedin: "", email: "", visible: true, sortOrder: (f.team ?? []).length + 1, status: "published" })}
              className="flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline"
            >
              <Plus size={14} /> Add Team Member
            </button>
          )}
        </div>
      </SectionBlock>

      {/* Timeline */}
      <SectionBlock title="Timeline / Our Journey" icon={<TrendingUp size={16} />}>
        <p className="text-xs text-[#8a958f]">Edit each milestone. Year is shown in the circle, Event is the description text.</p>
        <div className="space-y-4">
          {(f.timeline ?? []).map((m: any, i: number) => (
            <div key={i} className="p-4 bg-[#f7f4ef] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173f35] bg-[#173f35]/10 px-2 py-0.5 rounded-full">Milestone {i + 1}</span>
                {(f.timeline ?? []).length > 1 && (
                  <button onClick={() => removeArrayItem("timeline", i)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field label="Year / Period" value={m.year ?? ""} onChange={v => setArrayItem("timeline", i, "year", v)} placeholder="2025" />
                <div className="md:col-span-3">
                  <Field label="Description" value={m.event ?? ""} onChange={v => setArrayItem("timeline", i, "event", v)} type="textarea" />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem("timeline", { year: "", event: "" })}
            className="flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline"
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>
      </SectionBlock>

      {/* Sectors */}
      <SectionBlock title="Sectors We Operate In" icon={<Globe size={16} />}>
        <p className="text-xs text-[#8a958f]">Edit the section heading, subheading, and each sector tile. You can add or remove tiles, and change the icon for each one.</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Section Headline" value={f.sectorHeadline ?? ""} onChange={v => setForm((prev: any) => ({ ...prev, sectorHeadline: v }))} placeholder="Sectors we operate in" />
          <Field label="Section Subheadline" value={f.sectorSubheadline ?? ""} onChange={v => setForm((prev: any) => ({ ...prev, sectorSubheadline: v }))} placeholder="Our practice spans critical infrastructure..." />
        </div>
        <div className="space-y-3 mt-2">
          {(f.sectors ?? []).map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#f7f4ef] rounded-xl">
              <div className="flex-1 grid grid-cols-[1fr_1.5fr] gap-3 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#10231f] block">Icon</label>
                  <select
                    value={s.icon ?? "Landmark"}
                    onChange={e => setArrayItem("sectors", i, "icon", e.target.value)}
                    className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <Field label="Label" value={s.label ?? ""} onChange={v => setArrayItem("sectors", i, "label", v)} placeholder="e.g. Energy" />
              </div>
              {(f.sectors ?? []).length > 1 && (
                <button onClick={() => removeArrayItem("sectors", i)} className="text-red-400 hover:text-red-600 transition-colors mt-5 shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => addArrayItem("sectors", { icon: "Landmark", label: "" })}
          className="flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline mt-1"
        >
          <Plus size={14} /> Add Sector
        </button>
      </SectionBlock>

      {/* CTA */}
      <SectionBlock title="Bottom CTA Banner" icon={<Handshake size={16} />}>
        <Field label="Headline" value={f.cta?.headline ?? ""} onChange={v => setNested("cta", "headline", v)} />
        <Field label="Sub-headline" value={f.cta?.subheadline ?? ""} onChange={v => setNested("cta", "subheadline", v)} type="textarea" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Button 1 Text" value={f.cta?.btn1Text ?? ""} onChange={v => setNested("cta", "btn1Text", v)} />
          <Field label="Button 1 Link" value={f.cta?.btn1Link ?? ""} onChange={v => setNested("cta", "btn1Link", v)} />
          <Field label="Button 2 Text" value={f.cta?.btn2Text ?? ""} onChange={v => setNested("cta", "btn2Text", v)} />
          <Field label="Button 2 Link" value={f.cta?.btn2Link ?? ""} onChange={v => setNested("cta", "btn2Link", v)} />
        </div>
      </SectionBlock>

      <div className="flex items-center gap-3 justify-end pt-2 sticky bottom-0 bg-white border-t border-[#e5ded3] p-4 -mx-6 -mb-6 rounded-b-2xl">
        {saved && <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold"><Check size={14} /> Saved successfully</span>}
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#173f35] text-white text-sm font-bold hover:bg-[#245d4e] transition-colors disabled:opacity-60 shadow-md"
        >
          {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save All About Page Changes
        </button>
      </div>
    </div>
  );
}
