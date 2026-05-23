import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Lock, LogOut, LayoutDashboard, Inbox, FolderOpen, FileText,
  Eye, EyeOff, Settings, Settings2, BarChart2, Briefcase, Target,
  ChevronDown, ChevronRight, Quote, Navigation, Palette, Activity, Users,
} from "lucide-react";
import LeadsTable from "@/src/components/admin/LeadsTable";
import ProjectsTable from "@/src/components/admin/ProjectsTable";
import DashboardHome from "@/src/components/admin/DashboardHome";
import DocumentsTable from "@/src/components/admin/DocumentsTable";
import SettingsPanel from "@/src/components/admin/SettingsPanel";
import ContentStatsManager from "@/src/components/admin/ContentStatsManager";
import ServicesManager from "@/src/components/admin/ServicesManager";
import MethodologyManager from "@/src/components/admin/MethodologyManager";
import SiteSettingsManager from "@/src/components/admin/SiteSettingsManager";
import TestimonialsManager from "@/src/components/admin/TestimonialsManager";
import NavigationManager from "@/src/components/admin/NavigationManager";
import BrandingManager from "@/src/components/admin/BrandingManager";
import AuditLogViewer from "@/src/components/admin/AuditLogViewer";
import TeamManager from "@/src/components/admin/TeamManager";
import logo from "@/assets/logo.png";

type TabId = "dashboard" | "leads" | "projects" | "documents" | "settings"
  | "site_settings" | "content_stats" | "services_mgr" | "methodology"
  | "testimonials" | "navigation" | "branding" | "audit_log" | "team";

type NavItem = { id: TabId; label: string; icon: React.ElementType; desc: string };

const SIDEBAR_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Stats & recent activity" },
    ],
  },
  {
    group: "Content",
    items: [
      { id: "site_settings", label: "Site Settings", icon: Settings2, desc: "Hero, about, footer & SEO" },
      { id: "content_stats", label: "Site Stats", icon: BarChart2, desc: "Homepage numbers" },
      { id: "services_mgr", label: "Services", icon: Briefcase, desc: "Consulting service cards" },
      { id: "methodology", label: "Methodology", icon: Target, desc: "Delivery model steps" },
      { id: "team", label: "Leadership Team", icon: Users, desc: "Team member profiles & order" },
      { id: "testimonials", label: "Testimonials", icon: Quote, desc: "Client quotes & partners" },
      { id: "navigation", label: "Navigation Menu", icon: Navigation, desc: "Header nav links & order" },
      { id: "branding", label: "Branding", icon: Palette, desc: "Colors, logo & typography" },
    ],
  },
  {
    group: "Pipeline",
    items: [
      { id: "projects", label: "Projects", icon: FolderOpen, desc: "Project pipeline" },
      { id: "documents", label: "Documents", icon: FileText, desc: "Files & reports" },
    ],
  },
  {
    group: "CRM",
    items: [
      { id: "leads", label: "Inquiries", icon: Inbox, desc: "Contact form leads" },
    ],
  },
  {
    group: "Admin",
    items: [
      { id: "audit_log", label: "Activity Log", icon: Activity, desc: "Track all admin actions" },
      { id: "settings", label: "Settings", icon: Settings, desc: "Password & data export" },
    ],
  },
];

const ALL_TABS: NavItem[] = SIDEBAR_GROUPS.flatMap(g => g.items);

function SidebarGroup({ group, items, activeTab, onSelect, collapsed, onToggle }: {
  group: string; items: NavItem[]; activeTab: TabId;
  onSelect: (id: TabId) => void; collapsed: boolean; onToggle: () => void;
}) {
  const hasActive = items.some(i => i.id === activeTab);
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#f7f4ef] transition-colors group"
      >
        <span className={`text-[10px] font-bold uppercase tracking-widest ${hasActive ? "text-[#173f35]" : "text-[#8a958f]"}`}>{group}</span>
        {collapsed ? <ChevronRight size={12} className="text-[#8a958f]" /> : <ChevronDown size={12} className="text-[#8a958f]" />}
      </button>
      {!collapsed && (
        <div className="space-y-0.5 mt-0.5">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-[#173f35] text-white shadow-md"
                    : "text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-sm leading-tight">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? "text-white/65" : "text-[#a0a8a4]"}`}>{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then(r => r.json())
      .then(d => { if (d.authenticated) setIsAuthenticated(true); })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});
    setIsAuthenticated(false);
  };

  const toggleGroup = (group: string) => setCollapsed(c => ({ ...c, [group]: !c[group] }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={logo} alt="Zafora Holding" className="h-16 w-auto mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[#10231f] mb-1">Admin Sign In</h1>
            <p className="text-[#65736f] text-sm">Enter your password to manage the website</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full border rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] ${error ? "border-red-400 bg-red-50" : "border-[#e5ded3] bg-[#f7f4ef]"}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f] hover:text-[#10231f]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <Lock size={14} /> Wrong password. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[#65736f] hover:text-[#173f35] transition-colors">
                Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTabInfo = ALL_TABS.find(t => t.id === activeTab)!;
  const activeGroup = SIDEBAR_GROUPS.find(g => g.items.some(i => i.id === activeTab))?.group ?? "";

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f4ef" }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-[#e5ded3] hidden md:flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-5 border-b border-[#e5ded3] shrink-0">
          <img src={logo} alt="Zafora Holding" className="h-9 w-auto object-contain" />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {SIDEBAR_GROUPS.map(g => (
            <SidebarGroup
              key={g.group}
              group={g.group}
              items={g.items}
              activeTab={activeTab}
              onSelect={setActiveTab}
              collapsed={!!collapsed[g.group]}
              onToggle={() => toggleGroup(g.group)}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-[#e5ded3] shrink-0 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#65736f] hover:text-[#173f35] rounded-xl hover:bg-[#efe3cf] transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
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

      {/* ── Main ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[#e5ded3] bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#8a958f] font-medium hidden md:inline">{activeGroup}</span>
              {activeGroup && <span className="text-[#e5ded3] hidden md:inline">/</span>}
              <h1 className="font-bold text-[#10231f] text-base">{activeTabInfo?.label}</h1>
            </div>
            <p className="text-[10px] text-[#8a958f] hidden md:block leading-tight">{activeTabInfo?.desc}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline text-sm font-medium">Sign Out</span>
          </button>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex overflow-x-auto bg-white border-b border-[#e5ded3] px-2 py-2 gap-1.5 shrink-0">
          {ALL_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive ? "bg-[#173f35] text-white" : "text-[#65736f] bg-[#f7f4ef]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {activeTab === "dashboard" && <DashboardHome onNavigate={(tab) => setActiveTab(tab as TabId)} />}
          {activeTab === "leads" && <LeadsTable />}
          {activeTab === "projects" && <ProjectsTable />}
          {activeTab === "documents" && <DocumentsTable />}
          {activeTab === "settings" && <SettingsPanel />}
          {activeTab === "site_settings" && <SiteSettingsManager />}
          {activeTab === "content_stats" && <ContentStatsManager />}
          {activeTab === "services_mgr" && <ServicesManager />}
          {activeTab === "methodology" && <MethodologyManager />}
          {activeTab === "testimonials" && <TestimonialsManager />}
          {activeTab === "navigation" && <NavigationManager />}
          {activeTab === "branding" && <BrandingManager />}
          {activeTab === "team" && <TeamManager />}
          {activeTab === "audit_log" && <AuditLogViewer />}
        </div>
      </main>
    </div>
  );
}
