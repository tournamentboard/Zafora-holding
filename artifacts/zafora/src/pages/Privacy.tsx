import { useGetSiteSettings } from "@workspace/api-client-react";
import { useSeoMeta } from "@/hooks/use-seo-meta";
import { Shield, Loader2 } from "lucide-react";

const DEFAULT = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  content: `Zafora Holding ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

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

function renderContent(text: string) {
  return text.split("\n\n").map((para, i) => {
    if (para.startsWith("**") && para.endsWith("**")) {
      return <h2 key={i} className="text-lg font-bold text-[#10231f] mt-8 mb-3">{para.replace(/\*\*/g, "")}</h2>;
    }
    const lines = para.split("\n");
    const isList = lines.some(l => l.startsWith("- "));
    if (isList) {
      return (
        <ul key={i} className="space-y-2 my-4 ml-4">
          {lines.map((line, j) => line.startsWith("- ")
            ? <li key={j} className="text-[#4a5e57] text-base leading-relaxed flex gap-2"><span className="text-[#c59b4a] mt-1.5 shrink-0">•</span><span>{line.slice(2)}</span></li>
            : <li key={j} className="text-[#4a5e57] text-base leading-relaxed">{line}</li>
          )}
        </ul>
      );
    }
    const formatted = para.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-[#4a5e57] text-base leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

export default function Privacy() {
  useSeoMeta("Privacy Policy — Zafora Holding");
  const { data, isLoading } = useGetSiteSettings("legal_privacy");

  const page = (() => {
    try { if (data?.value) return { ...DEFAULT, ...JSON.parse(data.value) }; } catch {}
    return DEFAULT;
  })();

  return (
    <div style={{ background: "#f7f4ef" }} className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#173f35] text-white py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <Shield size={12} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{page.title}</h1>
          <p className="text-white/60 text-sm">Last updated: {page.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin h-8 w-8 text-[#173f35]" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#e5ded3] p-8 md:p-12">
              {renderContent(page.content)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
