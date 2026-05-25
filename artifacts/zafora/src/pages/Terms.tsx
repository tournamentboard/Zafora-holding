import { useGetSiteSettings } from "@workspace/api-client-react";
import { useSeoMeta } from "@/hooks/use-seo-meta";
import { FileText, Loader2 } from "lucide-react";

const DEFAULT = {
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

export default function Terms() {
  useSeoMeta("Terms of Service — Zafora Holding");
  const { data, isLoading } = useGetSiteSettings("legal_terms");

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
            <FileText size={12} /> Legal
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
