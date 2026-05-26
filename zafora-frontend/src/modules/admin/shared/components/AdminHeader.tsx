"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Globe } from "lucide-react";
import { ROUTES, API } from "@/src/lib/url-helpers";
import { apiAxios, clearTokens } from "@/src/lib/api-helpers";

const ROUTE_META: Record<string, { label: string; group: string; desc: string }> = {
  [ROUTES.ADMIN.ROOT]:              { label: "Dashboard",          group: "Overview",      desc: "Stats & recent activity" },
  [ROUTES.ADMIN.LEADS]:             { label: "Inquiries",          group: "CRM",           desc: "Contact form leads" },
  [ROUTES.ADMIN.PROJECTS]:          { label: "Projects",           group: "Pipeline",      desc: "Project pipeline" },
  [ROUTES.ADMIN.DOCUMENTS]:         { label: "Documents",          group: "Pipeline",      desc: "Files & reports" },
  [ROUTES.ADMIN.CONTENT]:           { label: "Content",            group: "Content",       desc: "CMS management" },
  [ROUTES.ADMIN.AUDIT]:             { label: "Activity Log",       group: "Admin",         desc: "Track all admin actions" },
  [ROUTES.ADMIN.SETTINGS]:          { label: "Settings",           group: "Admin",         desc: "Password & data export" },
  [ROUTES.ADMIN.FAQ]:               { label: "FAQs",               group: "Content",       desc: "Frequently asked questions" },
  [ROUTES.ADMIN.ANNOUNCEMENT]:      { label: "Announcement Bar",   group: "Site Control",  desc: "Sitewide banner message" },
  [ROUTES.ADMIN.SECTION_VISIBILITY]:{ label: "Section Visibility", group: "Site Control",  desc: "Show/hide page sections" },
  [ROUTES.ADMIN.MAINTENANCE]:       { label: "Maintenance Mode",   group: "Site Control",  desc: "Lock site for maintenance" },
  [ROUTES.ADMIN.LEGAL]:             { label: "Legal Pages",        group: "Content",       desc: "Privacy Policy & Terms of Service" },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const meta =
    ROUTE_META[pathname] ??
    Object.entries(ROUTE_META).find(([key]) => key !== ROUTES.ADMIN.ROOT && pathname.startsWith(key))?.[1] ??
    { label: "Admin", group: "", desc: "" };

  const handleLogout = async () => {
    try {
      await apiAxios.post(API.AUTH.LOGOUT);
    } catch {
      // ignore network errors — still clear local tokens
    }
    clearTokens();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className="h-14 border-b border-[#e5ded3] bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div>
        <div className="flex items-center gap-1.5">
          {meta.group && (
            <>
              <span className="text-xs text-[#8a958f] font-medium hidden md:inline">{meta.group}</span>
              <span className="text-[#e5ded3] hidden md:inline">/</span>
            </>
          )}
          <h1 className="font-bold text-[#10231f] text-base">{meta.label}</h1>
        </div>
        {meta.desc && (
          <p className="text-[10px] text-[#8a958f] hidden md:block leading-tight">{meta.desc}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#65736f] hover:text-[#173f35] hover:bg-[#f7f4ef] transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline text-sm font-medium">View Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
