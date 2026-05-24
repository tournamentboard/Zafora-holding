"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuditLogs, useClearAuditLogs } from "@/src/modules/admin/audit";
import { Activity, Trash2, RefreshCw, Loader2, AlertCircle } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  CRM: "bg-blue-100 text-blue-700",
  Pipeline: "bg-green-100 text-green-700",
  Content: "bg-amber-100 text-amber-700",
  Settings: "bg-purple-100 text-purple-700",
  Auth: "bg-red-100 text-red-700",
};
const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-sky-100 text-sky-700",
  delete: "bg-red-100 text-red-600",
  login: "bg-violet-100 text-violet-700",
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

export default function AuditLogViewer() {
  const { data: logs = [], isLoading, refetch } = useAuditLogs(100);
  const { mutateAsync: clearLogs, isPending: clearing } = useClearAuditLogs();
  const [filter, setFilter] = useState("all");

  const handleClear = async () => {
    if (!window.confirm("Clear all audit logs? This cannot be undone.")) return;
    try {
      await clearLogs();
    } catch {
      toast.error("Could not clear logs.");
    }
  };

  const categories = ["all", ...Array.from(new Set(logs.map((l) => l.category)))];
  const filtered = filter === "all" ? logs : logs.filter((l) => l.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#10231f] flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#173f35]" /> Activity Log
        </h2>
        <p className="text-sm text-[#65736f] mt-0.5">
          A record of every action taken on your website — edits, new inquiries, project changes, and more.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filter === cat ? "bg-[#173f35] text-white" : "bg-white border border-[#e5ded3] text-[#65736f] hover:border-[#173f35]"}`}>
              {cat === "all" ? `All (${logs.length})` : cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e5ded3] text-sm text-[#65736f] bg-white hover:border-[#173f35] transition-colors">
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={handleClear} disabled={clearing || logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-sm text-red-600 bg-white hover:bg-red-50 transition-colors disabled:opacity-40">
            <Trash2 size={13} /> Clear All
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e5ded3] rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-[#8a958f]">
            <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading logs...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#8a958f] gap-2">
            <AlertCircle className="h-8 w-8 opacity-40" />
            <p className="text-sm">{logs.length === 0 ? "No activity logged yet." : "No logs match this filter."}</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0ebe4]">
            {filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-[#faf8f5] transition-colors">
                <div className="shrink-0 mt-0.5 flex flex-col gap-1.5 items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600"}`}>{log.action}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[log.category] ?? "bg-gray-100 text-gray-600"}`}>{log.category}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#10231f] font-medium leading-snug">{log.description}</p>
                  {log.detail && Object.keys(log.detail).length > 0 && (
                    <p className="text-xs text-[#8a958f] mt-0.5 font-mono">
                      {Object.entries(log.detail).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="text-xs text-[#8a958f] shrink-0 pt-0.5 whitespace-nowrap">{timeAgo(log.performedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#173f35]/5 border border-[#173f35]/15 rounded-2xl p-4 text-sm text-[#65736f] flex gap-3">
        <Activity className="h-4 w-4 text-[#173f35] shrink-0 mt-0.5" />
        <span><strong className="text-[#10231f]">What gets logged:</strong> New inquiries, status changes, project creates/updates/deletes, and partner interests.</span>
      </div>
    </div>
  );
}
