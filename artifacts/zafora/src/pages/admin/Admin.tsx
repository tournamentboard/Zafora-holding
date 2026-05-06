import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShieldAlert, LogOut, LayoutDashboard, Users, FolderKanban, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeadsTable from "@/components/admin/LeadsTable";
import ProjectsTable from "@/components/admin/ProjectsTable";
import DashboardHome from "@/components/admin/DashboardHome";
import DocumentsTable from "@/components/admin/DocumentsTable";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
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
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("zafora_admin_auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <ShieldAlert className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">Zafora Admin</h1>
            <p className="text-muted-foreground text-sm text-center mt-2">Restricted Area. Authorized Personnel Only.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Enter access code" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-background border-border ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                autoFocus
              />
              {error && <p className="text-destructive text-sm">Invalid access code</p>}
            </div>
            <Button type="submit" className="w-full font-bold">
              Verify Identity <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-white transition-colors">
              ← Return to public site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-border hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <span className="text-xl font-serif font-bold text-white tracking-tight">
            ZAFORA<span className="text-primary">.Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("leads")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            <Users className="h-4 w-4" /> Lead Inbox
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            <FolderKanban className="h-4 w-4" /> Project Pipeline
          </button>
          <button 
            onClick={() => setActiveTab("documents")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'documents' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
          >
            <FileText className="h-4 w-4" /> Document Center
          </button>
        </nav>
        
        <div className="p-4 border-t border-border">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden h-16 border-b border-border bg-secondary flex items-center justify-between px-4">
          <span className="font-serif font-bold text-white">Admin Portal</span>
          <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto bg-secondary border-b border-border p-2 gap-2">
          {["dashboard", "leads", "projects", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === tab ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
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