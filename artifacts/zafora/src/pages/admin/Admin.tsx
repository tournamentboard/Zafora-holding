import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Lock, LogOut, LayoutDashboard, Inbox, FolderOpen, FileText, Eye, EyeOff } from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import ProjectsTable from "@/components/admin/ProjectsTable";
import DashboardHome from "@/components/admin/DashboardHome";
import DocumentsTable from "@/components/admin/DocumentsTable";
import logo from "@/assets/logo.png";

const TABS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard, desc: "Stats & recent activity" },
  { id: "leads", label: "Inquiries", icon: Inbox, desc: "People who contacted you" },
  { id: "projects", label: "Projects", icon: FolderOpen, desc: "Your project pipeline" },
  { id: "documents", label: "Documents", icon: FileText, desc: "Files & reports" },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const auth = localStorage.getItem("zafora_admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "zafora2024") {
      setIsAuthenticated(true);
      localStorage.setItem("zafora_admin_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("zafora_admin_auth");
  };

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
                ← Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeTabInfo = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f4ef" }}>
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#e5ded3] hidden md:flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-[#e5ded3]">
          <img src={logo} alt="Zafora Holding" className="h-10 w-auto object-contain" />
        </div>

        <div className="px-4 py-2 mt-2">
          <p className="text-xs font-semibold text-[#8a958f] uppercase tracking-wider px-2 mb-2">Website Manager</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-[#173f35] text-white shadow-md"
                    : "text-[#65736f] hover:bg-[#efe3cf] hover:text-[#10231f]"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className={`text-xs ${isActive ? "text-white/70" : "text-[#8a958f]"}`}>{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e5ded3]">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-[#65736f] hover:text-[#173f35] rounded-lg hover:bg-[#efe3cf] transition-colors mb-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-[#e5ded3] bg-white flex items-center justify-between px-4 md:px-8">
          <div>
            <h1 className="font-bold text-[#10231f] text-lg">{activeTabInfo.label}</h1>
            <p className="text-xs text-[#8a958f] hidden md:block">{activeTabInfo.desc}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </header>

        {/* Mobile tab bar */}
        <div className="md:hidden flex overflow-x-auto bg-white border-b border-[#e5ded3] px-2 py-2 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive ? "bg-[#173f35] text-white" : "text-[#65736f]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "leads" && <LeadsTable />}
          {activeTab === "projects" && <ProjectsTable />}
          {activeTab === "documents" && <DocumentsTable />}
        </div>
      </main>
    </div>
  );
}
