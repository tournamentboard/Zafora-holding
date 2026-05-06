import { useGetStats, useGetProjectStats } from "@workspace/api-client-react";
import {
  Users, FolderOpen, FileText, TrendingUp, Clock, AlertCircle,
  CheckCircle2, Lightbulb, RefreshCw, Bell, ArrowRight, BarChart2
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
    desc: "Review new inquiries every Monday. Move each one from 'New' → 'Reviewed' → 'Contacted' to keep your pipeline moving. Reply within 48 hours to maximize conversion.",
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
    desc: "If you haven't already, go to Settings → Change Admin Password. Use a strong, unique password and never share it over email or text.",
  },
];

export default function DashboardHome() {
  const { data: stats, isLoading } = useGetStats();
  const { data: projectStats } = useGetProjectStats();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-[#e5ded3]" />)}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-[#e5ded3]" />
      </div>
    );
  }

  const cards = [
    {
      label: "New Inquiries",
      sublabel: "People who filled in the contact form",
      value: stats?.totalLeads ?? 0,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
      badge: stats?.newLeadsThisMonth ? `${stats.newLeadsThisMonth} new this month` : "No new ones",
    },
    {
      label: "Projects Listed",
      sublabel: "Projects visible on your website",
      value: stats?.activeProjects ?? 0,
      icon: <FolderOpen className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
      badge: "In your pipeline",
    },
    {
      label: "Partner Interests",
      sublabel: "Investors/partners who expressed interest",
      value: stats?.totalInterests ?? 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600",
      badge: "Total expressions",
    },
    {
      label: "Documents",
      sublabel: "Files in your document center",
      value: stats?.totalDocuments ?? 0,
      icon: <FileText className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
      badge: "In secure storage",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-[#10231f] mb-1">Good day! Here's what's happening.</h2>
        <p className="text-[#65736f]">A quick look at everything on your website right now.</p>
      </div>

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
            <div className="mt-3 text-xs font-medium text-[#65736f] bg-[#f7f4ef] rounded-lg px-2 py-1 inline-block">
              {card.badge}
            </div>
          </div>
        ))}
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

        {/* Projects by Sector */}
        <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="h-5 w-5 text-[#8a958f]" />
            <div>
              <h3 className="text-lg font-bold text-[#10231f]">Projects by Sector</h3>
              <p className="text-sm text-[#8a958f]">How your pipeline is distributed</p>
            </div>
          </div>

          {projectStats?.bySector && projectStats.bySector.length > 0 ? (
            <div className="space-y-3">
              {projectStats.bySector.slice(0, 8).map((s: any) => (
                <div key={s.sector} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-[#10231f] shrink-0 truncate">{s.sector}</div>
                  <div className="flex-1 bg-[#f7f4ef] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-[#173f35] transition-all"
                      style={{ width: `${Math.min(100, (s.count / (projectStats?.total || 1)) * 100)}%` }}
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

      {/* How to use this admin panel */}
      <div className="bg-[#173f35] text-white rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">How to use this admin panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { icon: <Users className="h-5 w-5" />, title: "Inquiries", desc: "Read messages, update lead status, email contacts." },
            { icon: <FolderOpen className="h-5 w-5" />, title: "Projects", desc: "Add, edit, or remove projects shown on your website." },
            { icon: <FileText className="h-5 w-5" />, title: "Documents", desc: "Add files with preview — Google Drive, Dropbox, PDF." },
            { icon: <TrendingUp className="h-5 w-5" />, title: "Overview", desc: "See all stats, recent activity, and sector breakdown." },
            { icon: <ArrowRight className="h-5 w-5" />, title: "Settings", desc: "Change your password and export leads to CSV." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="bg-white/10 rounded-lg p-2 h-fit shrink-0">{item.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-white/70 text-xs leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
