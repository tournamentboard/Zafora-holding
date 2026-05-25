"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Check, FileText, Shield } from "lucide-react";
import { useGetSiteSettings, useUpdateSiteSettings } from "../services/site-settings.service";

const PRIVACY_DEFAULT = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  content: `Zafora Holding is committed to protecting your privacy. This policy explains how we collect and use your information when you visit our website.\n\nWe collect information you voluntarily provide (name, email, company) and usage data. We use it to respond to inquiries and improve our services. We do not sell your personal data.\n\nContact us at Office@zaforaholding.com with any questions.`,
};

const TERMS_DEFAULT = {
  title: "Terms of Service",
  lastUpdated: "January 2025",
  content: `By accessing this website you agree to these Terms of Service.\n\nAll content on this site is the property of Zafora Holding and protected by applicable laws. You may use this site for lawful purposes only.\n\nZafora Holding shall not be liable for any indirect or consequential damages arising from use of this site.\n\nContact us at Office@zaforaholding.com with any questions.`,
};

type Page = "privacy" | "terms";

export default function LegalPagesEditor() {
  const [activePage, setActivePage] = useState<Page>("privacy");

  const { data: privacyData, isLoading: privacyLoading } = useGetSiteSettings("legal_privacy");
  const { data: termsData, isLoading: termsLoading } = useGetSiteSettings("legal_terms");
  const updateMutation = useUpdateSiteSettings();

  const [privacy, setPrivacy] = useState({ ...PRIVACY_DEFAULT });
  const [terms, setTerms] = useState({ ...TERMS_DEFAULT });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (privacyData?.value) {
      try { setPrivacy({ ...PRIVACY_DEFAULT, ...JSON.parse(privacyData.value) }); } catch {}
    }
  }, [privacyData?.value]);

  useEffect(() => {
    if (termsData?.value) {
      try { setTerms({ ...TERMS_DEFAULT, ...JSON.parse(termsData.value) }); } catch {}
    }
  }, [termsData?.value]);

  const handleSave = () => {
    const key = activePage === "privacy" ? "legal_privacy" : "legal_terms";
    const value = activePage === "privacy" ? privacy : terms;
    updateMutation.mutate(
      { key, data: { value: JSON.stringify(value) } },
      {
        onSuccess: () => { toast.success("Legal page saved"); setSaved(true); setTimeout(() => setSaved(false), 3000); },
        onError: () => toast.error("Failed to save"),
      },
    );
  };

  const isLoading = privacyLoading || termsLoading;
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin h-6 w-6 text-[#173f35]" /></div>;
  }

  const current = activePage === "privacy" ? privacy : terms;
  const setCurrent = activePage === "privacy"
    ? (k: string, v: string) => setPrivacy((p) => ({ ...p, [k]: v }))
    : (k: string, v: string) => setTerms((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#10231f]">Legal Pages</h1>
          <p className="text-xs text-[#8a958f] mt-0.5">Edit your Privacy Policy and Terms of Service pages.</p>
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

      <div className="flex gap-2">
        {([
          { id: "privacy" as Page, label: "Privacy Policy", icon: Shield },
          { id: "terms" as Page, label: "Terms of Service", icon: FileText },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActivePage(id); setSaved(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activePage === id
                ? "bg-[#173f35] text-white shadow-md"
                : "bg-white border border-[#e5ded3] text-[#65736f] hover:bg-[#f7f4ef]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ded3] p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#10231f]">Page Title</label>
            <input
              type="text"
              value={current.title}
              onChange={(e) => setCurrent("title", e.target.value)}
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#10231f]">Last Updated Date</label>
            <input
              type="text"
              value={current.lastUpdated}
              onChange={(e) => setCurrent("lastUpdated", e.target.value)}
              placeholder="e.g. January 2025"
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#10231f]">Page Content</label>
            <span className="text-[11px] text-[#8a958f]">Plain text — use \n\n for paragraph breaks</span>
          </div>
          <textarea
            rows={22}
            value={current.content}
            onChange={(e) => setCurrent("content", e.target.value)}
            className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white font-mono leading-relaxed resize-y"
          />
        </div>

        <div className="bg-[#f7f4ef] rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-[#173f35] flex items-center justify-center shrink-0">
            <div className="h-1.5 w-1.5 rounded-full bg-[#173f35]" />
          </div>
          <p className="text-xs text-[#65736f]">
            This page is publicly accessible at{" "}
            <strong>{activePage === "privacy" ? "/privacy" : "/terms"}</strong>.
            Changes take effect immediately after saving.
          </p>
        </div>
      </div>
    </div>
  );
}
