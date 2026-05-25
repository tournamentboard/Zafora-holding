"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Check, ShieldAlert, AlertTriangle } from "lucide-react";
import { useGetSiteSettings, useUpdateSiteSettings } from "../services/site-settings.service";

const DEFAULTS = {
  enabled: false,
  headline: "We'll be back soon.",
  message: "We're performing scheduled maintenance. Please check back shortly.",
  showContactEmail: true,
  estimatedTime: "",
};

export default function MaintenanceManager() {
  const { data, isLoading } = useGetSiteSettings("maintenance_mode");
  const updateMutation = useUpdateSiteSettings();
  const [mode, setMode] = useState({ ...DEFAULTS });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try { setMode({ ...DEFAULTS, ...JSON.parse(data.value) }); } catch {}
    }
  }, [data?.value]);

  const set = (key: string, val: unknown) => setMode((prev) => ({ ...prev, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "maintenance_mode", data: { value: JSON.stringify(mode) } },
      {
        onSuccess: () => { toast.success("Maintenance mode saved"); setSaved(true); setTimeout(() => setSaved(false), 3000); },
        onError: () => toast.error("Failed to save"),
      },
    );
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">Maintenance Mode</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">Temporarily lock the public site while you make changes.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173f35] text-white font-semibold text-sm hover:bg-[#245d4e] transition-colors disabled:opacity-60"
        >
          {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {mode.enabled && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Maintenance mode is currently active</p>
            <p className="text-xs text-red-600 mt-0.5">Visitors will see the maintenance page. The admin panel remains accessible.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-[#e5ded3] p-6 space-y-5">
            <h2 className="font-bold text-[#10231f] text-base">Maintenance Page Content</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#10231f]">Headline</label>
              <input
                type="text"
                value={mode.headline}
                onChange={(e) => set("headline", e.target.value)}
                placeholder="We'll be back soon."
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#10231f]">Message</label>
              <textarea
                rows={3}
                value={mode.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="We're performing scheduled maintenance..."
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#10231f]">Estimated Return Time (optional)</label>
              <input
                type="text"
                value={mode.estimatedTime}
                onChange={(e) => set("estimatedTime", e.target.value)}
                placeholder="e.g. Back online by 3:00 PM EST"
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe3]">
              <div>
                <p className="text-sm font-semibold text-[#10231f]">Show contact email</p>
                <p className="text-[11px] text-[#8a958f] mt-0.5">Displays your contact email on the maintenance page.</p>
              </div>
              <button
                onClick={() => set("showContactEmail", !mode.showContactEmail)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mode.showContactEmail ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${mode.showContactEmail ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#c59b4a]" />
              <h2 className="font-bold text-[#10231f] text-base">Mode Status</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#10231f]">Maintenance active</p>
                <p className={`text-[11px] mt-0.5 font-semibold ${mode.enabled ? "text-red-500" : "text-green-600"}`}>
                  {mode.enabled ? "Site is locked" : "Site is live"}
                </p>
              </div>
              <button
                onClick={() => set("enabled", !mode.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mode.enabled ? "bg-red-500" : "bg-[#d0c9bf]"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${mode.enabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
            <div className="bg-[#f7f4ef] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#65736f] leading-relaxed">
                When active, public pages redirect to the maintenance screen. The admin panel at <strong>/admin</strong> remains accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
