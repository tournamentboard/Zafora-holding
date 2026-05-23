import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, Megaphone } from "lucide-react";

const DEFAULTS = {
  enabled: false,
  message: "Welcome to Zafora Holding",
  link: "",
  linkText: "Learn more",
  type: "info" as "info" | "success" | "warning",
  dismissible: true,
  bgColor: "#173f35",
  textColor: "#ffffff",
};

export default function AnnouncementManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetSiteSettings("announcement_bar");
  const updateMutation = useUpdateSiteSettings();
  const [bar, setBar] = useState({ ...DEFAULTS });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.value) {
      try {
        const parsed = JSON.parse(data.value);
        setBar({ ...DEFAULTS, ...parsed });
      } catch {}
    }
  }, [data?.value]);

  const set = (key: string, val: any) => setBar(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    updateMutation.mutate(
      { key: "announcement_bar", data: { value: JSON.stringify(bar) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["/api/content/settings/announcement_bar"] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-[#173f35]" />
    </div>
  );

  const previewBg = bar.bgColor || "#173f35";
  const previewText = bar.textColor || "#ffffff";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">Announcement Bar</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">Display a sitewide banner at the top of every page.</p>
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

      {/* Live Preview */}
      {bar.message && (
        <div className="rounded-xl overflow-hidden border border-[#e5ded3]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a958f] px-4 py-2 bg-[#f7f4ef] border-b border-[#e5ded3]">Preview</p>
          <div className="px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium" style={{ backgroundColor: previewBg, color: previewText }}>
            <Megaphone size={14} />
            <span>{bar.message}</span>
            {bar.link && bar.linkText && (
              <span className="underline opacity-80 text-xs">{bar.linkText}</span>
            )}
            {bar.dismissible && <span className="ml-2 text-xs opacity-60 cursor-pointer">✕</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-[#e5ded3] p-6 space-y-5">
            <h2 className="font-bold text-[#10231f] text-base">Bar Content</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#10231f]">Message</label>
              <input
                type="text"
                value={bar.message}
                onChange={e => set("message", e.target.value)}
                placeholder="We're now accepting new project inquiries for 2025..."
                className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Link URL (optional)</label>
                <input
                  type="text"
                  value={bar.link}
                  onChange={e => set("link", e.target.value)}
                  placeholder="/submit"
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Link Text (optional)</label>
                <input
                  type="text"
                  value={bar.linkText}
                  onChange={e => set("linkText", e.target.value)}
                  placeholder="Learn more"
                  className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={bar.bgColor} onChange={e => set("bgColor", e.target.value)} className="h-10 w-10 rounded-lg border border-[#e5ded3] cursor-pointer" />
                  <input type="text" value={bar.bgColor} onChange={e => set("bgColor", e.target.value)} className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm font-mono text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#10231f]">Text Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={bar.textColor} onChange={e => set("textColor", e.target.value)} className="h-10 w-10 rounded-lg border border-[#e5ded3] cursor-pointer" />
                  <input type="text" value={bar.textColor} onChange={e => set("textColor", e.target.value)} className="flex-1 border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm font-mono text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f0ebe3]">
              <div>
                <p className="text-sm font-semibold text-[#10231f]">Allow visitors to dismiss</p>
                <p className="text-[11px] text-[#8a958f] mt-0.5">Shows a close button on the bar.</p>
              </div>
              <button
                onClick={() => set("dismissible", !bar.dismissible)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bar.dismissible ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${bar.dismissible ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Enable toggle */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-4">
            <h2 className="font-bold text-[#10231f] text-base">Visibility</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#10231f]">Show on website</p>
                <p className={`text-[11px] mt-0.5 font-semibold ${bar.enabled ? "text-green-600" : "text-[#8a958f]"}`}>
                  {bar.enabled ? "Live on site" : "Hidden"}
                </p>
              </div>
              <button
                onClick={() => set("enabled", !bar.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bar.enabled ? "bg-[#173f35]" : "bg-[#d0c9bf]"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${bar.enabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="bg-[#f7f4ef] rounded-xl px-4 py-3">
              <p className="text-[11px] text-[#65736f] leading-relaxed">
                The announcement bar appears at the very top of every page when enabled. Save your changes before toggling live.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e5ded3] p-5 space-y-2">
            <h2 className="font-bold text-[#10231f] text-sm">Quick Presets</h2>
            {[
              { label: "Forest Green", bg: "#173f35", text: "#ffffff" },
              { label: "Gold", bg: "#c59b4a", text: "#10231f" },
              { label: "Dark", bg: "#10231f", text: "#ffffff" },
              { label: "Cream", bg: "#efe3cf", text: "#173f35" },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => { set("bgColor", p.bg); set("textColor", p.text); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f7f4ef] transition-colors text-left"
              >
                <span className="h-5 w-5 rounded-md border border-[#e5ded3] shrink-0" style={{ backgroundColor: p.bg }} />
                <span className="text-sm text-[#10231f]">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
