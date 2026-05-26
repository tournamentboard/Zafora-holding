"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLeads } from "@/src/modules/admin/leads";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import {
  Lock, Eye, EyeOff, Download, CheckCircle2, Globe,
  Mail, MapPin, Phone, Shield, RefreshCw, Bell,
  Send, Loader2, AlertCircle, ToggleLeft, ToggleRight,
} from "lucide-react";

const SITE_INFO = [
  { icon: <Globe className="h-4 w-4" />, label: "Website", value: "zaforaholding.com" },
  { icon: <Mail className="h-4 w-4" />, label: "Email", value: "Office@zaforaholding.com" },
  { icon: <MapPin className="h-4 w-4" />, label: "Address", value: "3030 N Rocky Point Dr W, Suite 150, Tampa, FL 33607" },
  { icon: <Phone className="h-4 w-4" />, label: "Admin path", value: "/admin" },
];

function exportLeadsToCSV(leads: Array<Record<string, unknown>>) {
  if (!leads.length) return;
  const headers = ["Name", "Email", "Phone", "Organization", "Country", "Role", "Request Type", "Status", "Message", "Date"];
  const rows = leads.map((l) => [
    l["fullName"] ?? "", l["email"] ?? "", l["phone"] ?? "", l["organization"] ?? "",
    l["country"] ?? "", l["roleType"] ?? "", l["requestType"] ?? "", l["status"] ?? "",
    String(l["message"] ?? "").replace(/"/g, '""'),
    l["createdAt"] ? new Date(l["createdAt"] as string).toLocaleDateString() : "",
  ]);
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zafora-leads-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`transition-colors rounded-full p-0 leading-none ${value ? "text-[#173f35]" : "text-[#c5c0b8]"}`}>
      {value ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
    </button>
  );
}

export default function SettingsPanel() {
  const { data: leadsData } = useLeads({ limit: 1000 });

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null);
  const [notifEmail, setNotifEmail] = useState("Office@zaforaholding.com");
  const [notifyOnInquiry, setNotifyOnInquiry] = useState(true);
  const [notifyOnInterest, setNotifyOnInterest] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifLoaded, setNotifLoaded] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    apiAxios.get(API.NOTIFICATIONS.STATUS)
      .then((r) => setEmailConfigured(!!(r.data as { configured?: boolean }).configured))
      .catch(() => setEmailConfigured(false));

    apiAxios.get(API.CONTENT.SETTINGS("notifications"))
      .then((r) => {
        try {
          const val = JSON.parse((r.data as { value?: string }).value ?? "{}");
          setNotifEmail(val.adminEmail ?? "");
          setNotifyOnInquiry(val.notifyOnInquiry !== false);
          setNotifyOnInterest(val.notifyOnInterest !== false);
        } catch { /* use defaults */ }
        setNotifLoaded(true);
      })
      .catch(() => setNotifLoaded(true));
  }, []);

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    try {
      await apiAxios.patch(API.CONTENT.SETTINGS("notifications"), {
        value: JSON.stringify({ adminEmail: notifEmail, notifyOnInquiry, notifyOnInterest }),
      });
      toast.success("Notification settings saved.");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setNotifSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!notifEmail) { toast.error("Enter a notification email first."); return; }
    setSendingTest(true);
    try {
      const r = await apiAxios.post<{ ok: boolean; error?: string }>(API.NOTIFICATIONS.TEST, { email: notifEmail });
      if (r.data.ok) {
        toast.success(`Test email sent to ${notifEmail}.`);
      } else {
        toast.error(`Failed: ${r.data.error}`);
      }
    } catch {
      toast.error("Failed to send test email.");
    } finally {
      setSendingTest(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPw.length < 4) { setPwError("New password must be at least 4 characters."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    try {
      await apiAxios.post(API.AUTH.CHANGE_PASSWORD, { currentPassword: currentPw, newPassword: newPw });
      setPwSuccess(true);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      toast.success("Password updated successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setPwError(msg);
    }
  };

  const handleExportLeads = () => {
    const leads = (leadsData?.leads ?? []) as unknown as Array<Record<string, unknown>>;
    if (!leads.length) { toast.error("No leads to export yet."); return; }
    exportLeadsToCSV(leads);
    toast.success(`Exported ${leads.length} lead${leads.length !== 1 ? "s" : ""} to CSV.`);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#10231f] mb-1">Settings</h2>
        <p className="text-[#65736f]">Manage email notifications, admin access, and data export.</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Email Notifications</h3>
        </div>
        <p className="text-sm text-[#65736f] mb-5">
          Get notified by email the moment someone submits an inquiry or expresses interest.
        </p>

        {emailConfigured === false && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-0.5">RESEND_API_KEY not yet configured</p>
              <p className="text-xs text-amber-700">
                Add <code className="bg-amber-100 rounded px-1 py-0.5">RESEND_API_KEY</code> to your environment variables. Get a free key at{" "}
                <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline font-semibold">resend.com</a>.
              </p>
            </div>
          </div>
        )}
        {emailConfigured === true && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-800">Email delivery is active via Resend.</p>
          </div>
        )}

        {notifLoaded && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Notification Email Address</label>
              <input type="email" value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)} placeholder="your@email.com"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-[#f7f4ef]">
                <div>
                  <p className="text-sm font-semibold text-[#10231f]">Notify on new inquiry</p>
                  <p className="text-xs text-[#8a958f]">When someone submits the contact form</p>
                </div>
                <Toggle value={notifyOnInquiry} onChange={setNotifyOnInquiry} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-[#10231f]">Notify on project interest</p>
                  <p className="text-xs text-[#8a958f]">When someone expresses interest in a project</p>
                </div>
                <Toggle value={notifyOnInterest} onChange={setNotifyOnInterest} />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={handleSaveNotifications} disabled={notifSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white font-bold text-sm hover:bg-[#245d4e] transition-colors disabled:opacity-60">
                {notifSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Save Settings
              </button>
              <button onClick={handleSendTest} disabled={sendingTest || !emailConfigured}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#173f35] text-[#173f35] font-bold text-sm hover:bg-[#173f35] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {sendingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send Test Email
              </button>
            </div>
          </div>
        )}
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

      {/* Change Password */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Change Admin Password</h3>
        </div>

        {pwSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" /> Password updated!
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showCurrentPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Your current password"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-10" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNewPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 4 characters"
                className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef] pr-10" />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a958f]">
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#10231f] mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat new password"
              className="w-full border border-[#e5ded3] rounded-xl px-4 py-3 text-[#10231f] placeholder-[#8a958f] focus:outline-none focus:ring-2 focus:ring-[#173f35] bg-[#f7f4ef]" />
          </div>
          {pwError && <p className="text-red-500 text-sm flex items-center gap-1.5"><Lock size={14} /> {pwError}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-colors">Update Password</button>
        </form>
      </div>

      {/* Export Data */}
      <div className="bg-white border border-[#e5ded3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Download className="h-5 w-5 text-[#173f35]" />
          <h3 className="text-lg font-bold text-[#10231f]">Export Leads to CSV</h3>
        </div>
        <p className="text-sm text-[#65736f] mb-5">Download all inquiry leads as a spreadsheet.</p>
        <button onClick={handleExportLeads}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#173f35] text-[#173f35] font-bold hover:bg-[#173f35] hover:text-white transition-all">
          <Download className="h-4 w-4" />
          Export {leadsData?.leads?.length ?? 0} Lead{(leadsData?.leads?.length ?? 0) !== 1 ? "s" : ""} (.csv)
        </button>
      </div>

      {/* Security Note */}
      <div className="bg-[#173f35] text-white rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-[#c59b4a]" />
          <h4 className="font-bold">Security Reminder</h4>
        </div>
        <ul className="space-y-2 text-sm text-white/75">
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Change the default password to something unique and strong.</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Never share admin login credentials by email or text.</li>
          <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Sign out when using a shared or public device.</li>
          <li className="flex items-start gap-2"><RefreshCw className="h-4 w-4 text-[#c59b4a] mt-0.5 shrink-0" /> Export your leads regularly as a backup.</li>
        </ul>
      </div>
    </div>
  );
}
