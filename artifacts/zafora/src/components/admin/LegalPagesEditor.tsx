import { useState, useEffect } from "react";
import { useGetSiteSettings, useUpdateSiteSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, FileText, Shield } from "lucide-react";

const PRIVACY_DEFAULT = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  content: `Zafora Holding ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website zaforaholding.com.

**Information We Collect**

We may collect information about you in a variety of ways including:
- Personal data you voluntarily provide (name, email, phone, company)
- Usage data collected automatically when you visit our site
- Cookies and tracking technologies

**How We Use Your Information**

We use the information we collect to:
- Respond to your inquiries and consultation requests
- Send you relevant information about our services
- Improve our website and services
- Comply with legal obligations

**Disclosure of Your Information**

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to trusted partners who assist us in operating our business.

**Contact Us**

If you have questions about this Privacy Policy, please contact us at Office@zaforaholding.com`,
};

const TERMS_DEFAULT = {
  title: "Terms of Service",
  lastUpdated: "January 2025",
  content: `Please read these Terms of Service carefully before using the Zafora Holding website.

**Acceptance of Terms**

By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.

**Use of Site**

You may use this website for lawful purposes only. You agree not to use the site in any way that could damage, disable, or impair the site or interfere with any other party's use of the site.

**Intellectual Property**

All content on this website, including text, graphics, logos, and images, is the property of Zafora Holding and is protected by applicable intellectual property laws.

**Disclaimer**

The information on this website is provided on an "as is" basis. Zafora Holding makes no warranties, expressed or implied, and hereby disclaims all other warranties.

**Limitation of Liability**

Zafora Holding shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the site.

**Contact Us**

If you have questions about these Terms, please contact us at Office@zaforaholding.com`,
};

type Page = "privacy" | "terms";

export default function LegalPagesEditor() {
  const qc = useQueryClient();
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
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [`/api/content/settings/${key}`] });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      }
    );
  };

  const isLoading = privacyLoading || termsLoading;

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-[#173f35]" />
    </div>
  );

  const current = activePage === "privacy" ? privacy : terms;
  const setCurrent = activePage === "privacy"
    ? (k: string, v: string) => setPrivacy(p => ({ ...p, [k]: v }))
    : (k: string, v: string) => setTerms(p => ({ ...p, [k]: v }));

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

      {/* Page selector */}
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
              onChange={e => setCurrent("title", e.target.value)}
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#10231f]">Last Updated Date</label>
            <input
              type="text"
              value={current.lastUpdated}
              onChange={e => setCurrent("lastUpdated", e.target.value)}
              placeholder="e.g. January 2025"
              className="w-full border border-[#e5ded3] rounded-xl px-3 py-2.5 text-sm text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35]/30 bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-[#10231f]">Page Content</label>
            <span className="text-[11px] text-[#8a958f]">Markdown supported: **bold**, # headers, - lists</span>
          </div>
          <textarea
            rows={22}
            value={current.content}
            onChange={e => setCurrent("content", e.target.value)}
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
