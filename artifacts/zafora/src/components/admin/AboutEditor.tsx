import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check, Loader2, Info, ChevronDown, ChevronRight,
  Users, Target, Eye, Globe, ShieldCheck, TrendingUp,
  Award, Handshake, MapPin, Plus, Trash2,
} from "lucide-react";

type Section = "hero" | "stats" | "identity" | "whoweare" | "mvp" | "values" | "team" | "timeline" | "cta";

const ABOUT_DEFAULTS = {
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
  team: [
    { initials: "ZH", name: "Leadership", title: "Executive Team", bio: "Zafora Holding's leadership brings deep expertise in infrastructure, strategic consulting, international business development, and global partnerships.", location: "Tampa, FL, USA" },
    { initials: "ZH", name: "Advisory", title: "Strategic Advisors", bio: "Our advisory network spans infrastructure, government relations, technology, and international markets across Africa, the Americas, and beyond.", location: "Global" },
    { initials: "ZH", name: "Operations", title: "Operations Team", bio: "Supporting project development, partnership management, compliance readiness, and day-to-day strategic execution across all active engagements.", location: "Tampa, FL, USA" },
    { initials: "ZH", name: "Partnerships", title: "Global Partnerships", bio: "Building and managing relationships with governments, contractors, investors, and enterprise organizations across emerging and developed markets.", location: "Global Markets" },
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

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: "text" | "textarea"; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#10231f] block">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white resize-y"
        />
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

  const setArrayItem = (section: string, idx: number, key: string, val: string) =>
    setForm((f: any) => {
      const arr = [...(f[section] ?? [])];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...f, [section]: arr };
    });

  const addArrayItem = (section: string, template: object) =>
    setForm((f: any) => ({ ...f, [section]: [...(f[section] ?? []), { ...template }] }));

  const removeArrayItem = (section: string, idx: number) =>
    setForm((f: any) => ({ ...f, [section]: (f[section] ?? []).filter((_: any, i: number) => i !== idx) }));

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
      <SectionBlock title="Leadership Team (4 cards)" icon={<Users size={16} />}>
        <p className="text-xs text-[#8a958f]">Edit each team card. Initials is the large letter shown in the colored header.</p>
        <div className="space-y-4">
          {(f.team ?? []).map((member: any, i: number) => (
            <div key={i} className="p-4 bg-[#f7f4ef] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173f35] bg-[#173f35]/10 px-2 py-0.5 rounded-full">Card {i + 1}</span>
                {(f.team ?? []).length > 1 && (
                  <button onClick={() => removeArrayItem("team", i)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="Initials" value={member.initials ?? ""} onChange={v => setArrayItem("team", i, "initials", v)} placeholder="ZH" />
                <Field label="Name" value={member.name ?? ""} onChange={v => setArrayItem("team", i, "name", v)} placeholder="Leadership" />
                <Field label="Title" value={member.title ?? ""} onChange={v => setArrayItem("team", i, "title", v)} placeholder="Executive Team" />
                <Field label="Location" value={member.location ?? ""} onChange={v => setArrayItem("team", i, "location", v)} placeholder="Tampa, FL, USA" />
              </div>
              <Field label="Bio" value={member.bio ?? ""} onChange={v => setArrayItem("team", i, "bio", v)} type="textarea" />
            </div>
          ))}
          {(f.team ?? []).length < 8 && (
            <button
              onClick={() => addArrayItem("team", { initials: "ZH", name: "", title: "", bio: "", location: "" })}
              className="flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline"
            >
              <Plus size={14} /> Add Team Card
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
