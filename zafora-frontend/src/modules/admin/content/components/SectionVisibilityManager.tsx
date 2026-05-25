"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Check, Eye, EyeOff, Layout } from "lucide-react";
import { useGetSiteSettings, useUpdateSiteSettings } from "../services/site-settings.service";

const PAGES_CONFIG: Record<string, { label: string; sections: { key: string; label: string; desc: string }[] }> = {
  home: {
    label: "Home",
    sections: [
      { key: "hero", label: "Hero", desc: "Main headline, CTA buttons, and hero panel" },
      { key: "ticker", label: "Countries Ticker", desc: "Scrolling country names strip" },
      { key: "stats", label: "Stats Bar", desc: "Key numbers and metrics" },
      { key: "services", label: "Services Preview", desc: "Services grid on the home page" },
      { key: "methodology", label: "Delivery Model", desc: "6-step methodology section" },
      { key: "testimonial", label: "Testimonial", desc: "Client quote section" },
      { key: "projects", label: "Project Pipeline", desc: "Featured projects preview" },
      { key: "sectors", label: "Sectors", desc: "Industry sectors grid" },
      { key: "cta", label: "CTA Banner", desc: "Bottom call-to-action section" },
    ],
  },
  about: {
    label: "About",
    sections: [
      { key: "hero", label: "Hero", desc: "Page header with headline and badges" },
      { key: "stats", label: "Stats Strip", desc: "Founded year, regions, focus areas" },
      { key: "story", label: "Our Story", desc: "Who we are — company story paragraphs" },
      { key: "mvp", label: "Mission / Vision / Purpose", desc: "Core identity statements" },
      { key: "values", label: "Core Values", desc: "6 value cards" },
      { key: "team", label: "Leadership Team", desc: "Team member profile cards" },
      { key: "timeline", label: "Timeline", desc: "Company history milestones" },
      { key: "cta", label: "CTA Banner", desc: "Bottom call-to-action" },
    ],
  },
  services: {
    label: "Services",
    sections: [
      { key: "hero", label: "Hero", desc: "Services page header" },
      { key: "stats", label: "Stats Strip", desc: "Value structured, countries, professionals" },
      { key: "cards", label: "Service Cards", desc: "6 service cards grid" },
      { key: "cta", label: "CTA Banner", desc: "Start a conversation section" },
    ],
  },
  projects: {
    label: "Projects",
    sections: [
      { key: "hero", label: "Hero", desc: "Projects page header" },
      { key: "filter", label: "Filter Bar", desc: "Sector, funding status, and search filters" },
      { key: "grid", label: "Projects Grid", desc: "Project cards and pipeline items" },
    ],
  },
  government: {
    label: "Government Review",
    sections: [
      { key: "hero", label: "Hero", desc: "Full-bleed photo hero with headline" },
      { key: "stats", label: "Stats Strip", desc: "Countries served, projects structured" },
      { key: "capability", label: "Capabilities", desc: "Capability cards and description" },
      { key: "framework", label: "Evaluation Framework", desc: "Review framework section" },
      { key: "cta", label: "CTA Banner", desc: "Confidential briefing call-to-action" },
    ],
  },
  submit: {
    label: "Submit Request",
    sections: [
      { key: "hero", label: "Hero", desc: "Submit page header" },
      { key: "form", label: "Submission Form", desc: "Contact form" },
      { key: "sidebar", label: "Trust Sidebar", desc: "Why submit to Zafora sidebar" },
    ],
  },
};

const DEFAULTS: Record<string, Record<string, boolean>> = Object.fromEntries(
  Object.entries(PAGES_CONFIG).map(([page, { sections }]) => [
    page,
    Object.fromEntries(sections.map((s) => [s.key, true])),
  ]),
);

export default function SectionVisibilityManager() {
  const { data, isLoading } = useGetSiteSettings("section_visibility");
  const updateMutation = useUpdateSiteSettings();
  const [visibility, setVisibility] = useState<Record<string, Record<string, boolean>>>(DEFAULTS);
  const [activePage, setActivePage] = useState("home");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setVisibility((prev) => {
          const merged = { ...prev };
          for (const page of Object.keys(PAGES_CONFIG)) {
            merged[page] = { ...DEFAULTS[page], ...(parsed[page] ?? {}) };
          }
          return merged;
        });
      } catch {}
    }
  }, [data?.value]);

  const toggle = (page: string, section: string) => {
    setVisibility((prev) => ({
      ...prev,
      [page]: { ...prev[page], [section]: !prev[page]?.[section] },
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(
      { key: "section_visibility", data: { value: JSON.stringify(visibility) } },
      {
        onSuccess: () => { toast.success("Section visibility saved"); setSaved(true); setTimeout(() => setSaved(false), 3000); },
        onError: () => toast.error("Failed to save"),
      },
    );
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;
  }

  const currentPage = PAGES_CONFIG[activePage]!;
  const currentVisibility = visibility[activePage] ?? {};
  const hiddenCount = currentPage.sections.filter((s) => !currentVisibility[s.key]).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">Section Visibility</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">Show or hide individual sections on each page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] transition-colors disabled:opacity-60"
        >
          {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(PAGES_CONFIG).map(([key, { label, sections }]) => {
          const pageVisibility = visibility[key] ?? {};
          const hidden = sections.filter((s) => !pageVisibility[s.key]).length;
          return (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activePage === key
                  ? "bg-[#173f35] text-white shadow-md"
                  : "bg-white border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef]"
              }`}
            >
              {label}
              {hidden > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activePage === key ? "bg-white/20" : "bg-[#e5ded3] text-[#65736f]"}`}>
                  {hidden} hidden
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ded3] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f0ebe3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout size={15} className="text-[#8a958f]" />
            <h2 className="font-bold text-[#10231f] text-base">{currentPage.label} page sections</h2>
          </div>
          {hiddenCount > 0 && (
            <span className="text-xs text-[#8a958f]">{hiddenCount} section{hiddenCount > 1 ? "s" : ""} hidden</span>
          )}
        </div>
        <div className="divide-y divide-[#f0ebe3]">
          {currentPage.sections.map((section) => {
            const isVisible = currentVisibility[section.key] !== false;
            return (
              <div
                key={section.key}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${!isVisible ? "bg-[#f7f4ef]/60" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isVisible ? "bg-[#173f35]/10" : "bg-[#e5ded3]"}`}>
                    {isVisible ? <Eye size={14} className="text-[#173f35]" /> : <EyeOff size={14} className="text-[#8a958f]" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isVisible ? "text-[#10231f]" : "text-[#8a958f]"}`}>{section.label}</p>
                    <p className="text-[11px] text-[#8a958f] mt-0.5">{section.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(activePage, section.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisible ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isVisible ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#f7f4ef] border border-[#e5ded3] rounded-xl px-5 py-3 flex items-center gap-3">
        <div className="h-4 w-4 rounded-full border-2 border-[#c59b4a] flex items-center justify-center shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-[#c59b4a]" />
        </div>
        <p className="text-xs text-[#65736f]">
          Hidden sections are removed from the live page immediately after saving. Content is preserved — you can re-enable sections at any time.
        </p>
      </div>
    </div>
  );
}
