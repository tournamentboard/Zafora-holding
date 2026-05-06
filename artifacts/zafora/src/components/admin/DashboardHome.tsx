import { useGetStats, useGetProjectStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FolderKanban, FileText, ArrowUpRight, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function DashboardHome() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: projectStats, isLoading: projectStatsLoading } = useGetProjectStats();

  if (statsLoading || projectStatsLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl bg-secondary/50" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-xl bg-secondary/50" />
          <Skeleton className="h-[400px] w-full rounded-xl bg-secondary/50" />
        </div>
      </div>
    );
  }

  const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#9333ea', '#475569'];

  const statCards = [
    { title: "Total Leads", value: stats?.totalLeads || 0, icon: <Users className="h-5 w-5" />, trend: `+${stats?.newLeadsThisMonth || 0} this month` },
    { title: "Active Projects", value: stats?.activeProjects || 0, icon: <FolderKanban className="h-5 w-5" />, trend: "in pipeline" },
    { title: "Total Interests", value: stats?.totalInterests || 0, icon: <BarChart3 className="h-5 w-5" />, trend: "from investors/partners" },
    { title: "Documents", value: stats?.totalDocuments || 0, icon: <FileText className="h-5 w-5" />, trend: "in secure storage" },
  ];

  const pieData = stats?.leadsByStatus?.map(s => ({
    name: s.status.replace("_", " ").toUpperCase(),
    value: s.count
  })) || [];

  const barData = projectStats?.bySector?.map(s => ({
    name: s.sector,
    value: s.count
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-white">System Overview</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                {card.icon}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{card.title}</div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                {card.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-white">Lead Status Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-white">Projects by Sector</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} allowDecimals={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--secondary))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col lg:col-span-2">
          <h3 className="font-bold text-lg mb-6 text-white">Recent Inquiries</h3>
          <div className="space-y-4 flex-1 overflow-auto max-h-[400px] pr-2">
            {stats?.recentLeads?.length ? (
              stats.recentLeads.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center p-4 hover:bg-secondary/50 rounded-lg transition-colors border border-border/50">
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-white truncate">{lead.organization || lead.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">{lead.requestType.replace("_", " ")} • {lead.country}</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-secondary rounded-md uppercase tracking-wider border border-border text-muted-foreground font-semibold">
                    {lead.status.replace("_", " ")}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}