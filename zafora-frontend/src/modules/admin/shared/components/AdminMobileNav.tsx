"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Inbox, FolderOpen, FileText, Settings, Settings2,
  BarChart2, Briefcase, Target, Quote, Navigation, Palette, Activity,
  Users, HelpCircle, Megaphone, ShieldAlert, Scale, Layout,
} from "lucide-react";
import { ROUTES } from "@/src/lib/url-helpers";

const ALL_TABS = [
  { label: "Dashboard",    href: ROUTES.ADMIN.ROOT,              icon: LayoutDashboard },
  { label: "Inquiries",    href: ROUTES.ADMIN.LEADS,             icon: Inbox },
  { label: "Projects",     href: ROUTES.ADMIN.PROJECTS,          icon: FolderOpen },
  { label: "Documents",    href: ROUTES.ADMIN.DOCUMENTS,         icon: FileText },
  { label: "Site Settings", href: ROUTES.ADMIN.CONTENT,          icon: Settings2 },
  { label: "Services",     href: ROUTES.ADMIN.CONTENT + "?section=services",     icon: Briefcase },
  { label: "Testimonials", href: ROUTES.ADMIN.CONTENT + "?section=testimonials", icon: Quote },
  { label: "Stats",        href: ROUTES.ADMIN.CONTENT + "?section=stats",        icon: BarChart2 },
  { label: "Methodology",  href: ROUTES.ADMIN.CONTENT + "?section=methodology",  icon: Target },
  { label: "Team",         href: ROUTES.ADMIN.CONTENT + "?section=team",         icon: Users },
  { label: "FAQs",         href: ROUTES.ADMIN.FAQ,               icon: HelpCircle },
  { label: "Navigation",   href: ROUTES.ADMIN.CONTENT + "?section=navigation",   icon: Navigation },
  { label: "Branding",     href: ROUTES.ADMIN.CONTENT + "?section=branding",     icon: Palette },
  { label: "Legal",        href: ROUTES.ADMIN.LEGAL,             icon: Scale },
  { label: "Announcement", href: ROUTES.ADMIN.ANNOUNCEMENT,      icon: Megaphone },
  { label: "Visibility",   href: ROUTES.ADMIN.SECTION_VISIBILITY, icon: Layout },
  { label: "Maintenance",  href: ROUTES.ADMIN.MAINTENANCE,       icon: ShieldAlert },
  { label: "Activity Log", href: ROUTES.ADMIN.AUDIT,             icon: Activity },
  { label: "Settings",     href: ROUTES.ADMIN.SETTINGS,          icon: Settings },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");

  const isActive = (href: string) => {
    const [base, query] = href.split("?");
    const tabSection = query ? new URLSearchParams(query).get("section") : null;

    if (tabSection) {
      // Tab has a ?section= — must match both pathname and section
      return pathname === base && currentSection === tabSection;
    }

    // Tab has no section param — match only when pathname matches and no section is active on this base
    const sharesBase = ALL_TABS.some((t) => t.href.startsWith(base + "?"));
    if (sharesBase) {
      return pathname === base && !currentSection;
    }

    return pathname === base || (base !== ROUTES.ADMIN.ROOT && pathname.startsWith(base));
  };

  return (
    <div className="md:hidden flex overflow-x-auto bg-white border-b border-[#e5ded3] px-2 py-2 gap-1.5 shrink-0 scrollbar-none">
      {ALL_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              active
                ? "bg-[#173f35] text-white shadow-sm"
                : "bg-[#f7f4ef] text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f]"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
