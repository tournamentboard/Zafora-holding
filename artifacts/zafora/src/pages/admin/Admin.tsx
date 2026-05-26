import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Lock, LogOut, LayoutDashboard, Inbox, FolderOpen, FileText,
  Eye, EyeOff, Settings, Settings2, BarChart2, Briefcase, Target,
  ChevronDown, ChevronRight, Quote, Navigation, Palette, Activity, Users,
  Megaphone, ShieldAlert, Scale, HelpCircle, Layout, ArrowLeft, KeyRound,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import ProjectsTable from "@/components/admin/ProjectsTable";
import DashboardHome from "@/components/admin/DashboardHome";
import DocumentsTable from "@/components/admin/DocumentsTable";
import SettingsPanel from "@/components/admin/SettingsPanel";
import ContentStatsManager from "@/components/admin/ContentStatsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import MethodologyManager from "@/components/admin/MethodologyManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import NavigationManager from "@/components/admin/NavigationManager";
import BrandingManager from "@/components/admin/BrandingManager";
import AuditLogViewer from "@/components/admin/AuditLogViewer";
import TeamManager from "@/components/admin/TeamManager";
import AnnouncementManager from "@/components/admin/AnnouncementManager";
import MaintenanceManager from "@/components/admin/MaintenanceManager";
import LegalPagesEditor from "@/components/admin/LegalPagesEditor";
import FaqManager from "@/components/admin/FaqManager";
import SectionVisibilityManager from "@/components/admin/SectionVisibilityManager";
import logo from "@/assets/logo.png";

type TabId =
  | "dashboard" | "leads" | "projects" | "documents" | "settings"
  | "site_settings" | "content_stats" | "services_mgr" | "methodology"
  | "testimonials" | "navigation" | "branding" | "audit_log" | "team"
  | "announcement" | "maintenance" | "legal" | "faq" | "section_visibility";

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
      { id: "faq", label: "FAQs", icon: HelpCircle, desc: "Frequently asked questions" },
      { id: "navigation", label: "Navigation Menu", icon: Navigation, desc: "Header nav links & order" },
      { id: "branding", label: "Branding", icon: Palette, desc: "Colors, logo & typography" },
      { id: "legal", label: "Legal Pages", icon: Scale, desc: "Privacy Policy & Terms" },
    ],
  },
  {
    group: "Site Control",
    items: [
      { id: "announcement", label: "Announcement Bar", icon: Megaphone, desc: "Sitewide banner message" },
      { id: "section_visibility", label: "Section Visibility", icon: Layout, desc: "Show/hide page sections" },
      { id: "maintenance", label: "Maintenance Mode", icon: ShieldAlert, desc: "Lock site for maintenance" },
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

// ── First-Time Setup Screen ──────────────────────────────────────────
function SetupScreen({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [adminEmail, setAdminEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // If setup is already done on mount, redirect straight to login
  useEffect(() => {
    fetch("/api/admin/auth/setup-status")
      .then(r => r.json())
      .then(d => { if (!d.required) onSetupComplete(); })
      .catch(() => {});
  }, [onSetupComplete]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPw.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const d = await r.json();
      if (!r.ok) {
        // Setup already done — go straight to login
        if (d.error?.toLowerCase().includes("already complete")) {
          onSetupComplete();
          return;
        }
        setError(d.error || "Setup failed.");
        return;
      }
      setDone(true);
      setTimeout(onSetupComplete, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" style={{ imageRendering: "auto" }} />
          <div className="inline-flex items-center gap-2 bg-[#173f35]/10 text-[#173f35] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <KeyRound size={12} /> First-Time Setup
          </div>
          <h1 className="text-2xl font-bold text-[#10231f] mb-2">Create Admin Password</h1>
          <p className="text-[#65736f] text-sm">Set your secure admin password. This is required before you can sign in.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="font-bold text-[#10231f] text-lg mb-1">Password created successfully!</p>
              <p className="text-[#65736f] text-sm">Redirecting to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleSetup} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">
                  Authorized Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => { setAdminEmail(e.target.value); setError(""); }}
                  placeholder="your-admin-email@domain.com"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                  required
                />
                <p className="text-xs text-[#8a958f] mt-1.5">Must match the email set in your server's <code className="bg-[#f0ebe3] rounded px-1">ADMIN_SETUP_EMAIL</code> environment variable.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setError(""); }}
                    placeholder="At least 4 characters"
                    className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 pr-10 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => { setConfirmPw(e.target.value); setError(""); }}
                  placeholder="Repeat your password"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60"
              >
                {submitting ? "Creating password..." : "Create Admin Password"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6 space-y-2">
          <button
            onClick={onSetupComplete}
            className="text-sm text-[#173f35] font-semibold hover:underline flex items-center gap-1.5 mx-auto"
          >
            <ArrowLeft size={13} /> Already have a password? Go to Sign In
          </button>
          <p className="text-xs text-[#8a958f]">
            Once set, this setup form is permanently disabled. Use Admin Settings to change your password later.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Forgot Password / Reset Screen ──────────────────────────────────
function ResetPasswordScreen({ onBack }: { onBack: () => void }) {
  const [adminEmail, setAdminEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPw.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    try {
      const r = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminEmail, newPassword: newPw, confirmPassword: confirmPw }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Reset failed."); return; }
      setDone(true);
      setTimeout(onBack, 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" style={{ imageRendering: "auto" }} />
          <h1 className="text-2xl font-bold text-[#10231f] mb-1">Reset Password</h1>
          <p className="text-[#65736f] text-sm">Verify your admin email to set a new password.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ded3] shadow-lg p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="font-bold text-[#10231f] text-lg mb-1">Password reset successfully!</p>
              <p className="text-[#65736f] text-sm">Returning to sign in...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => { setAdminEmail(e.target.value); setError(""); }}
                  placeholder="your-admin-email@domain.com"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setError(""); }}
                    placeholder="At least 4 characters"
                    className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 pr-10 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#10231f] mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={e => { setConfirmPw(e.target.value); setError(""); }}
                  placeholder="Repeat your password"
                  className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold text-base hover:bg-[#245d4e] transition-colors disabled:opacity-60"
              >
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        {!done && (
          <button onClick={onBack} className="flex items-center gap-2 mx-auto mt-5 text-sm text-[#65736f] hover:text-[#173f35] transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Component ─────────────────────────────────────────────
export default function Admin() {
  const [authState, setAuthState] = useState<"loading" | "setup" | "login" | "reset" | "authenticated">("loading");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check auth status and whether first-time setup is required
    Promise.all([
      fetch("/api/admin/auth/check").then(r => r.json()).catch(() => ({ authenticated: false })),
      fetch("/api/admin/auth/setup-status").then(r => r.json()).catch(() => ({ required: false })),
    ]).then(([authData, setupData]) => {
      if (authData.authenticated) {
        setAuthState("authenticated");
      } else if (setupData.required) {
        setAuthState("setup");
      } else {
        setAuthState("login");
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const d = await r.json();
      if (r.ok) {
        setAuthState("authenticated");
        setError(false);
      } else if (d.setupRequired) {
        setAuthState("setup");
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
    setAuthState("login");
    setPassword("");
  };

  const toggleGroup = (group: string) => setCollapsed(c => ({ ...c, [group]: !c[group] }));

  // ── Loading ──
  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f4ef" }}>
        <img src={logo} alt="Zafora Holding" className="h-16 w-auto opacity-40 animate-pulse" />
      </div>
    );
  }

  // ── First-time setup ──
  if (authState === "setup") {
    return <SetupScreen onSetupComplete={() => setAuthState("login")} />;
  }

  // ── Forgot password / reset ──
  if (authState === "reset") {
    return <ResetPasswordScreen onBack={() => setAuthState("login")} />;
  }

  // ── Login ──
  if (authState === "login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "#f7f4ef" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={logo} alt="Zafora Holding" className="h-24 w-auto mx-auto mb-6" style={{ imageRendering: "auto" }} />
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

            <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#65736f]">
              <button
                onClick={() => setAuthState("reset")}
                className="hover:text-[#173f35] transition-colors flex items-center gap-1.5"
              >
                <KeyRound size={13} /> Forgot password?
              </button>
              <Link href="/" className="hover:text-[#173f35] transition-colors">
                Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated ──
  const activeTabInfo = ALL_TABS.find(t => t.id === activeTab)!;
  const activeGroup = SIDEBAR_GROUPS.find(g => g.items.some(i => i.id === activeTab))?.group ?? "";

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f4ef" }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-[#e5ded3] hidden md:flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-5 border-b border-[#e5ded3] shrink-0">
          <img src={logo} alt="Zafora Holding" className="h-14 w-auto object-contain" style={{ imageRendering: "auto" }} />
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
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#173f35] bg-[#173f35]/8 hover:bg-[#efe3cf] transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="hidden sm:inline">View Website</span>
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
          {activeTab === "announcement" && <AnnouncementManager />}
          {activeTab === "maintenance" && <MaintenanceManager />}
          {activeTab === "legal" && <LegalPagesEditor />}
          {activeTab === "faq" && <FaqManager />}
          {activeTab === "section_visibility" && <SectionVisibilityManager />}
        </div>
      </main>
    </div>
  );
}
