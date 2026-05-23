import { useState, useEffect } from "react";
import { useGetStats, useGetProjectStats } from "@/src/lib/api-client-react";
import {
  Users, FolderOpen, FileText, TrendingUp, Clock, AlertCircle,
  CheckCircle2, Lightbulb, RefreshCw, Bell, ArrowRight, BarChart2,
  Settings2, BarChart, Quote, Navigation, Palette, Activity,
  Briefcase, Target, Settings, Globe, Inbox, ExternalLink,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  in_progress: "In Progress",
  closed: "Closed",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewed: "bg-purple-100 text-purple-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  proposal_sent: "bg-orange-100 text-orange-700",
  in_progress: "bg-teal-100 text-teal-700",
  closed: "bg-gray-100 text-gray-600",
  rejected: "bg-red-100 text-red-600",
};

const MANAGEMENT_TIPS = [
  {
    icon: <Bell className="h-5 w-5 text-[#c59b4a]" />,
    title: "Check Inquiries Weekly",
    desc: "Review new inquiries every Monday. Move each one from 'New' to 'Reviewed' to 'Contacted' to keep your pipeline moving. Reply within 48 hours to maximize conversion.",
  },
  {
    icon: <FolderOpen className="h-5 w-5 text-[#c59b4a]" />,
    title: "Keep Projects Current",
    desc: "Update funding status and partner needs regularly. Stale project listings reduce credibility. Archive closed projects rather than deleting them so you maintain a track record.",
  },
  {
    icon: <FileText className="h-5 w-5 text-[#c59b4a]" />,
    title: "Upload Your Capability Statement",
    desc: "Add your Capability Statement as the first document and set visibility to 'Public'. This is the most requested document from government agencies and institutional investors.",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-[#c59b4a]" />,
    title: "Grow Your Pipeline Visibility",
    desc: "Projects with multi-sector tags and detailed descriptions attract 3x more interest. Add a project image URL and complete all fields — especially Partner Needs.",
  },
  {
    icon: <RefreshCw className="h-5 w-5 text-[#c59b4a]" />,
    title: "Export Leads Monthly",
    desc: "Go to Settings and export your leads to CSV each month. Store copies in Google Drive as a backup, and share with your team for outreach coordination.",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5 text-[#c59b4a]" />,
    title: "Change the Default Password",
    desc: "If you haven't already, go to Settings and change your Admin Password. Use a strong, unique password and never share it over email or text.",
  },
];

interface AuditLog {
  id: number;
  action: string;
  category: string;
  description: string;
  performedAt: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-sky-100 text-sky-700",
  delete: "bg-red-100 text-red-600",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const QUICK_LINKS: { label: string; desc: string; icon: React.ReactNode; tab: string }[] = [
  { label: "Site Settings", desc: "Hero, about & footer", icon: <Settings2 size={18} />, tab: "site_settings" },
  { label: "Services", desc: "Edit service cards", icon: <Briefcase size={18} />, tab: "services_mgr" },
  { label: "Projects", desc: "Manage pipeline", icon: <FolderOpen size={18} />, tab: "projects" },
  { label: "Inquiries", desc: "CRM & lead status", icon: <Inbox size={18} />, tab: "leads" },
  { label: "Testimonials", desc: "Client quotes", icon: <Quote size={18} />, tab: "testimonials" },
  { label: "Branding", desc: "Colors & logo", icon: <Palette size={18} />, tab: "branding" },
  { label: "Navigation", desc: "Header links", icon: <Navigation size={18} />, tab: "navigation" },
  { label: "Activity Log", desc: "All admin actions", icon: <Activity size={18} />, tab: "audit_log" },
];

interface DashboardHomeProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { data: stats, isLoading } = useGetStats();
  const { data: projectStats } = useGetProjectStats();
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit?limit=8")
      .then(r => r.json())
      .then(d => setRecentLogs(d.logs ?? []))
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-[#e5ded3]" />)}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-[#e5ded3]" />
      </div>
    );
  }

  const cards = [
    {
      label: "New Inquiries",
      sublabel: "Contact form submissions",
      value: stats?.totalLeads ?? 0,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
      badge: stats?.newLeadsThisMonth ? `+${stats.newLeadsThisMonth} this month` : "None this month",
      badgeColor: stats?.newLeadsThisMonth ? "text-blue-600" : "text-[#8a958f]",
    },
    {
      label: "Projects Listed",
      sublabel: "Live on your pipeline page",
      value: stats?.activeProjects ?? 0,
      icon: <FolderOpen className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
      badge: "In your pipeline",
      badgeColor: "text-[#8a958f]",
    },
    {
      label: "Partner Interests",
      sublabel: "Investors & partners engaged",
      value: stats?.totalInterests ?? 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600",
      badge: "Total expressions",
      badgeColor: "text-[#8a958f]",
    },
    {
      label: "Documents",
      sublabel: "Files in document center",
      value: stats?.totalDocuments ?? 0,
      icon: <FileText className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
      badge: "In secure storage",
      badgeColor: "text-[#8a958f]",
    },
  ];

  const newLeads = stats?.recentLeads?.filter(l => l.status === "new") ?? [];
  const hasPendingItems = newLeads.length > 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-[#10231f] mb-1">Good day! Here's what's happening.</h2>
          <p className="text-[#65736f]">A quick look at everything on your website right now.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#e5ded3] text-sm font-semibold text-[#173f35] bg-white hover:border-[#173f35] transition-colors"
        >
          <ExternalLink size={14} /> View Live Site
        </a>
      </div>

      {/* Alert banner for pending new inquiries */}
      {hasPendingItems && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <Bell className="h-5 w-5 text-blue-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-blue-800">
              {newLeads.length} new {newLeads.length === 1 ? "inquiry" : "inquiries"} waiting for review
            </p>
            <p className="text-xs text-blue-600 mt-0.5">Review and move each to "Reviewed" to keep your CRM organised.</p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate("leads")}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Review Now
            </button>
          )}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-[#e5ded3] rounded-2xl p-5 shadow-sm">
            <div className={`inline-flex p-2.5 rounded-xl mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-4xl font-bold text-[#10231f] mb-1">{card.value}</div>
            <div className="font-semibold text-[#10231f] text-sm mb-0.5">{card.label}</div>
            <div className="text-xs text-[#8a958f]">{card.sublabel}</div>
            <div className={`mt-3 text-xs font-medium ${card.badgeColor} bg-[#f7f4ef] rounded-lg px-2 py-1 inline-block`}>
              {card.badge}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="h-5 w-5 text-[#8a958f]" />
          <div>
            <h3 className="text-lg font-bold text-[#10231f]">Quick Access</h3>
            <p className="text-sm text-[#8a958f]">Jump to any section of the admin panel</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(link => (
            <button
              key={link.tab}
              onClick={() => onNavigate?.(link.tab)}
              className="flex flex-col items-start gap-2 p-4 rounded-xl border border-[#e5ded3] bg-[#f7f4ef] hover:border-[#173f35] hover:bg-white transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-white text-[#173f35] shadow-sm group-hover:bg-[#173f35] group-hover:text-white transition-colors">
                {link.icon}
              </div>
              <div>
                <div className="font-bold text-[#10231f] text-sm">{link.label}</div>
                <div className="text-xs text-[#8a958f]">{link.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-[#10231f]">Recent Inquiries</h3>
              <p className="text-sm text-[#8a958f]">Latest contacts from your website</p>
            </div>
            <Clock className="h-5 w-5 text-[#8a958f]" />
          </div>
          <div className="space-y-2.5">
            {stats?.recentLeads?.length ? stats.recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f7f4ef] hover:bg-[#efe3cf] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {lead.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[#10231f] text-sm truncate">{lead.fullName}</div>
                    <div className="text-xs text-[#65736f] truncate">{lead.organization}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2 ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[lead.status] || lead.status}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-[#8a958f]">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No inquiries yet. When someone fills out the contact form, they'll appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-[#8a958f]" />
            <div>
              <h3 className="text-lg font-bold text-[#10231f]">Recent Activity</h3>
              <p className="text-sm text-[#8a958f]">Latest changes across the admin panel</p>
            </div>
          </div>
          {logsLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-[#f7f4ef] rounded-xl animate-pulse" />)}
            </div>
          ) : recentLogs.length === 0 ? (
            <div className="text-center py-8 text-[#8a958f]">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No activity logged yet. Start making changes to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#f7f4ef]">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 mt-0.5 ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600"}`}>
                    {log.action}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#10231f] font-medium leading-snug truncate">{log.description}</p>
                    <p className="text-[10px] text-[#8a958f] mt-0.5">{timeAgo(log.performedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects by Sector */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="h-5 w-5 text-[#8a958f]" />
          <div>
            <h3 className="text-lg font-bold text-[#10231f]">Projects by Sector</h3>
            <p className="text-sm text-[#8a958f]">How your pipeline is distributed across sectors</p>
          </div>
        </div>
        {projectStats?.bySector && projectStats.bySector.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectStats.bySector.slice(0, 8).map((s: any) => (
              <div key={s.sector} className="flex items-center gap-3">
                <div className="w-24 text-xs font-semibold text-[#10231f] shrink-0 truncate">{s.sector}</div>
                <div className="flex-1 bg-[#f7f4ef] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-[#173f35] transition-all"
                    style={{ width: `${Math.min(100, (s.count / (projectStats?.bySector.reduce((acc, x) => acc + x.count, 0) || 1)) * 100)}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-[#10231f] w-5 text-right">{s.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#8a958f]">
            <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Add your first project to see sector breakdown.</p>
          </div>
        )}
      </div>

      {/* Site Management Guide */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="h-5 w-5 text-[#c59b4a]" />
          <div>
            <h3 className="text-lg font-bold text-[#10231f]">Site Management Best Practices</h3>
            <p className="text-sm text-[#8a958f]">Our recommendations to run this site effectively</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MANAGEMENT_TIPS.map((tip, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl bg-[#f7f4ef] hover:bg-[#efe3cf] transition-colors">
              <div className="bg-white rounded-xl p-2 h-fit shadow-sm shrink-0">{tip.icon}</div>
              <div>
                <div className="font-bold text-[#10231f] text-sm mb-1">{tip.title}</div>
                <div className="text-xs text-[#65736f] leading-relaxed">{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
