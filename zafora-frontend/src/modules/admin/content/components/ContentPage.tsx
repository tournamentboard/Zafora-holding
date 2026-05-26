"use client";

import { useSearchParams } from "next/navigation";
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

function ContentPageInner() {
  const searchParams = useSearchParams();
  const section = (searchParams.get("section") ?? "site-settings") as Section;

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
    <div>
      {renderSection()}
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
