"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard, Inbox, FolderOpen, FileText, Settings, Settings2,
  BarChart2, Briefcase, Target, ChevronDown, ChevronRight, Quote,
  Navigation, Palette, Activity, Users, LogOut, HelpCircle,
  Megaphone, ShieldAlert, Scale, Layout,
} from "lucide-react";
import { ROUTES, API } from "@/src/lib/url-helpers";
import { apiAxios, clearTokens } from "@/src/lib/api-helpers";
import logo from "@/src/assets/logo.png";

type NavItem = { label: string; href: string; icon: React.ElementType; desc: string };
type NavGroup = { group: string; items: NavItem[] };

const SIDEBAR_GROUPS: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: ROUTES.ADMIN.ROOT, icon: LayoutDashboard, desc: "Stats & recent activity" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Site Settings", href: ROUTES.ADMIN.CONTENT, icon: Settings2, desc: "Hero, about, footer & SEO" },
      { label: "Services", href: ROUTES.ADMIN.CONTENT + "?section=services", icon: Briefcase, desc: "Consulting service cards" },
      { label: "Testimonials", href: ROUTES.ADMIN.CONTENT + "?section=testimonials", icon: Quote, desc: "Client quotes & partners" },
      { label: "Site Stats", href: ROUTES.ADMIN.CONTENT + "?section=stats", icon: BarChart2, desc: "Homepage numbers" },
      { label: "Methodology", href: ROUTES.ADMIN.CONTENT + "?section=methodology", icon: Target, desc: "Delivery model steps" },
      { label: "Team", href: ROUTES.ADMIN.CONTENT + "?section=team", icon: Users, desc: "Leadership team profiles" },
      { label: "FAQs", href: ROUTES.ADMIN.FAQ, icon: HelpCircle, desc: "Frequently asked questions" },
      { label: "Navigation Menu", href: ROUTES.ADMIN.CONTENT + "?section=navigation", icon: Navigation, desc: "Header nav links & order" },
      { label: "Branding", href: ROUTES.ADMIN.CONTENT + "?section=branding", icon: Palette, desc: "Colors, logo & typography" },
      { label: "Legal Pages", href: ROUTES.ADMIN.LEGAL, icon: Scale, desc: "Privacy Policy & Terms" },
    ],
  },
  {
    group: "Site Control",
    items: [
      { label: "Announcement Bar", href: ROUTES.ADMIN.ANNOUNCEMENT, icon: Megaphone, desc: "Sitewide banner message" },
      { label: "Section Visibility", href: ROUTES.ADMIN.SECTION_VISIBILITY, icon: Layout, desc: "Show/hide page sections" },
      { label: "Maintenance Mode", href: ROUTES.ADMIN.MAINTENANCE, icon: ShieldAlert, desc: "Lock site for maintenance" },
    ],
  },
  {
    group: "Pipeline",
    items: [
      { label: "Projects", href: ROUTES.ADMIN.PROJECTS, icon: FolderOpen, desc: "Project pipeline" },
      { label: "Documents", href: ROUTES.ADMIN.DOCUMENTS, icon: FileText, desc: "Files & reports" },
    ],
  },
  {
    group: "CRM",
    items: [
      { label: "Inquiries", href: ROUTES.ADMIN.LEADS, icon: Inbox, desc: "Contact form leads" },
    ],
  },
  {
    group: "Admin",
    items: [
      { label: "Activity Log", href: ROUTES.ADMIN.AUDIT, icon: Activity, desc: "Track all admin actions" },
      { label: "Settings", href: ROUTES.ADMIN.SETTINGS, icon: Settings, desc: "Password & data export" },
    ],
  },
];

function SidebarGroup({
  group, items, pathname, currentSection, collapsed, onToggle,
}: {
  group: string;
  items: NavItem[];
  pathname: string;
  currentSection: string | null;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const isActive = (href: string) => {
    const [base, query] = href.split("?");
    const tabSection = query ? new URLSearchParams(query).get("section") : null;

    if (tabSection) {
      return pathname === base && currentSection === tabSection;
    }

    const sharesBase = items.some((t) => t.href.startsWith(base + "?"));
    if (sharesBase) {
      return pathname === base && !currentSection;
    }

    return pathname === base || (base !== ROUTES.ADMIN.ROOT && pathname.startsWith(base));
  };
  const hasActive = items.some((i) => isActive(i.href));

  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#f7f4ef] transition-colors"
      >
        <span className={`text-[10px] font-bold uppercase tracking-widest ${hasActive ? "text-[#173f35]" : "text-[#8a958f]"}`}>
          {group}
        </span>
        {collapsed ? (
          <ChevronRight size={12} className="text-[#8a958f]" />
        ) : (
          <ChevronDown size={12} className="text-[#8a958f]" />
        )}
      </button>
      {!collapsed && (
        <div className="space-y-0.5 mt-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-[#173f35] text-white shadow-md"
                    : "text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm leading-tight">{item.label}</div>
                  <div className={`text-[10px] truncate ${active ? "text-white/65" : "text-[#a0a8a4]"}`}>
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section");
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    try {
      await apiAxios.post(API.AUTH.LOGOUT);
    } catch {
      // ignore network errors — still clear local tokens
    }
    clearTokens();
    router.replace(ROUTES.LOGIN);
  };

  const toggle = (group: string) =>
    setCollapsed((c) => ({ ...c, [group]: !c[group] }));

  return (
    <aside className="w-64 bg-white border-r border-[#e5ded3] hidden md:flex flex-col shadow-sm shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-[#e5ded3] shrink-0">
        <Link href={ROUTES.ADMIN.ROOT}>
          <Image src={logo} alt="Zafora Holding" className="h-9 w-auto object-contain" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {SIDEBAR_GROUPS.map((g) => (
          <SidebarGroup
            key={g.group}
            group={g.group}
            items={g.items}
            pathname={pathname}
            currentSection={currentSection}
            collapsed={!!collapsed[g.group]}
            onToggle={() => toggle(g.group)}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-[#e5ded3] shrink-0 space-y-1">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#65736f] hover:text-[#173f35] rounded-xl hover:bg-[#efe3cf] transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
