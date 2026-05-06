import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useListLeads } from "@workspace/api-client-react";
import {
  Lock, Eye, EyeOff, Download, CheckCircle2, Globe,
  Mail, MapPin, Phone, Shield, RefreshCw
} from "lucide-react";

const SITE_INFO = [
  { icon: <Globe className="h-4 w-4" />, label: "Website", value: "zaforaholding.com" },
  { icon: <Mail className="h-4 w-4" />, label: "Email", value: "Office@zaforaholding.com" },
  { icon: <MapPin className="h-4 w-4" />, label: "Address", value: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607" },
  { icon: <Phone className="h-4 w-4" />, label: "Admin path", value: "/admin" },
];

function exportLeadsToCSV(leads: any[]) {
  if (!leads.length) return;
  const headers = ["Name", "Email", "Phone", "Organization", "Country", "Role", "Request Type", "Status", "Message", "Date"];
  const rows = leads.map(l => [
    l.fullName || "",
    l.email || "",
    l.phone || "",
    l.organization || "",
    l.country || "",
    l.roleType || "",
    l.requestType || "",
    l.status || "",
    (l.message || "").replace(/"/g, '""'),
    l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "",
  ]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zafora-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPanel() {
  const { toast } = useToast();
  const { data: leadsData } = useListLeads({ limit: 1000 });

  // Password change state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const STORED_PASSWORD = localStorage.getItem("zafora_admin_password") || "zafora2024";

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (currentPw !== STORED_PASSWORD) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    localStorage.setItem("zafora_admin_password", newPw);
    setPwSuccess(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    toast({ title: "Password updated successfully!" });
  };

  const handleExportLeads = () => {
    const leads = leadsData?.leads || [];
    if (!leads.length) {
      toast({ title: "No leads to export yet.", variant: "destructive" });
      return;
    }
    exportLeadsToCSV(leads);
    toast({ title: `Exported ${leads.length} lead${leads.length !== 1 ? "s" : ""} to CSV.` });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#10231f] mb-1">Settings</h2>
        <p className="text-[#65736f]">Manage your admin access and export your data.</p>
      </div>

      {/* Site Info Reference */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Site Reference</h3>
        </div>
        <div className="space-y-3">
          {SITE_INFO.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-[#f7f4ef] last:border-0">
              <div className="text-[#65736f] mt-0.5 shrink-0">{item.icon}</div>
              <div>
                <div className="text-xs font-semibold text-[#8a958f] uppercase tracking-wider mb-0.5">{item.label}</div>
                <div className="text-sm font-medium text-[#10231f]">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Admin Password */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Change Admin Password</h3>
        </div>

        {pwSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" /> Password updated! Use your new password next time you sign in.
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="Your current password"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-10"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-10"
              />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]"
            />
          </div>

          {pwError && (
            <p className="text-red-500 text-sm flex items-center gap-1.5">
              <Lock size={14} /> {pwError}
            </p>
          )}

          <button type="submit"
            className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors">
            Update Password
          </button>
        </form>
      </div>

      {/* Export Data */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Download className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Export Leads to CSV</h3>
        </div>
        <p className="text-sm text-[#65736f] mb-5">
          Download all your inquiry leads as a spreadsheet. Includes name, email, organization, status, and message for every contact.
        </p>
        <button
          onClick={handleExportLeads}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#173f35] text-[#173f35] font-bold hover:bg-[#173f35] hover:text-white transition-all"
        >
          <Download className="h-4 w-4" />
          Export {leadsData?.leads?.length || 0} Lead{leadsData?.leads?.length !== 1 ? "s" : ""} (.csv)
        </button>
      </div>

      {/* Security Note */}
      <div className="bg-[#173f35] text-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-[#c59b4a]" />
          <h4 className="font-bold">Security Reminder</h4>
        </div>
        <ul className="space-y-2 text-sm text-white/75">
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Change the default password (zafora2024) to something unique and strong.</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Never share admin login credentials by email or text message.</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Sign out when using a shared or public device.</li>
          <li className="flex items-start gap-2"><RefreshCw className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Export your leads regularly as a backup.</li>
        </ul>
      </div>
    </div>
  );
}
