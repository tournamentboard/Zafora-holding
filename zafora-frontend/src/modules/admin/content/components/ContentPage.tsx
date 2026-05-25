"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";
import SiteSettingsManager from "./SiteSettingsManager";
import BrandingManager from "./BrandingManager";
import NavigationManager from "./NavigationManager";
import TeamManager from "./TeamManager";
import ServicesManager from "./ServicesManager";
import TestimonialsManager from "./TestimonialsManager";
import ContentStatsManager from "./ContentStatsManager";
import MethodologyManager from "./MethodologyManager";

type Section =
  | "site-settings"
  | "branding"
  | "navigation"
  | "team"
  | "services"
  | "testimonials"
  | "stats"
  | "methodology";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "site-settings", label: "Site Settings" },
  { key: "branding", label: "Branding" },
  { key: "navigation", label: "Navigation" },
  { key: "team", label: "Team" },
  { key: "services", label: "Services" },
  { key: "testimonials", label: "Testimonials" },
  { key: "stats", label: "Stats" },
  { key: "methodology", label: "Methodology" },
];

function ContentPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const section = (searchParams.get("section") ?? "site-settings") as Section;

  const setSection = (key: Section) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderSection = () => {
    switch (section) {
      case "site-settings":
        return <SiteSettingsManager />;
      case "branding":
        return <BrandingManager />;
      case "navigation":
        return <NavigationManager />;
      case "team":
        return <TeamManager />;
      case "services":
        return <ServicesManager />;
      case "testimonials":
        return <TestimonialsManager />;
      case "stats":
        return <ContentStatsManager />;
      case "methodology":
        return <MethodologyManager />;
      default:
        return <SiteSettingsManager />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              section === s.key
                ? "bg-[#173f35] text-white shadow-sm"
                : "bg-white border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef] hover:text-[#173f35]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div>{renderSection()}</div>
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 border-4 border-[#173f35] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ContentPageInner />
    </Suspense>
  );
}
