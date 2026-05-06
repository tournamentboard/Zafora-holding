import { useGetStats, useGetProjectStats } from "@workspace/api-client-react";
import { Users, FolderOpen, FileText, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";

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
      new: stats?.newLeadsThisMonth ?? 0,
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
      sublabel: "Files stored in your document center",
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

      {/* Recent Inquiries */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-[#10231f]">Recent Inquiries</h3>
            <p className="text-sm text-[#8a958f]">The latest people who contacted you through the website</p>
          </div>
          <Clock className="h-5 w-5 text-[#8a958f]" />
        </div>

        <div className="space-y-3">
          {stats?.recentLeads?.length ? stats.recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl bg-[#f7f4ef] hover:bg-[#efe3cf] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {lead.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#10231f] truncate">{lead.fullName}</div>
                  <div className="text-xs text-[#65736f] truncate">{lead.organization} · {lead.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[lead.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[lead.status] || lead.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-[#8a958f]">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No inquiries yet. When someone fills out the contact form, they'll appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Projects by Sector */}
      {projectStats?.bySector && projectStats.bySector.length > 0 && (
        <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-[#10231f]">Projects by Sector</h3>
            <p className="text-sm text-[#8a958f]">How many projects you have in each category</p>
          </div>
          <div className="space-y-3">
            {projectStats.bySector.map((s: any) => (
              <div key={s.sector} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-[#10231f] shrink-0">{s.sector}</div>
                <div className="flex-1 bg-[#f7f4ef] rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-[#173f35] transition-all"
                    style={{ width: `${Math.min(100, (s.count / (projectStats?.total || 1)) * 100)}%` }}
                  />
                </div>
                <div className="text-sm font-bold text-[#10231f] w-6 text-right">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Help */}
      <div className="bg-[#173f35] text-white rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-3">How to use this admin panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Users className="h-5 w-5" />, title: "Inquiries tab", desc: "See who contacted you, read their messages, and update their status." },
            { icon: <FolderOpen className="h-5 w-5" />, title: "Projects tab", desc: "Add, edit, or remove projects shown on your website." },
            { icon: <FileText className="h-5 w-5" />, title: "Documents tab", desc: "Add or remove documents from your document center." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="bg-white/10 rounded-lg p-2 h-fit">{item.icon}</div>
              <div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-white/70 text-xs">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
