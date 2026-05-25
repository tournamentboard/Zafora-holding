import { Shield, FileText } from "lucide-react";

type Props = {
  icon: "Shield" | "FileText";
  title: string;
  lastUpdated: string;
  content: string;
};

function renderContent(text: string) {
  return text.split("\n\n").map((para, i) => {
    if (para.startsWith("**") && para.endsWith("**")) {
      return (
        <h2 key={i} className="text-lg font-bold text-[#10231f] mt-8 mb-3">
          {para.replace(/\*\*/g, "")}
        </h2>
      );
    }
    const lines = para.split("\n");
    const isList = lines.some((l) => l.startsWith("- "));
    if (isList) {
      return (
        <ul key={i} className="space-y-2 my-4 ml-4">
          {lines.map((line, j) =>
            line.startsWith("- ") ? (
              <li key={j} className="text-[#4a5e57] text-base leading-relaxed flex gap-2">
                <span className="text-[#c59b4a] mt-1.5 shrink-0">•</span>
                <span>{line.slice(2)}</span>
              </li>
            ) : (
              <li key={j} className="text-[#4a5e57] text-base leading-relaxed">
                {line}
              </li>
            ),
          )}
        </ul>
      );
    }
    const formatted = para.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return (
      <p
        key={i}
        className="text-[#4a5e57] text-base leading-relaxed my-4"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

export default function LegalPageView({ icon, title, lastUpdated, content }: Props) {
  const Icon = icon === "Shield" ? Shield : FileText;

  return (
    <div style={{ background: "#f7f4ef" }} className="min-h-screen">
      <section className="bg-[#173f35] text-white py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
            <Icon size={12} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{title}</h1>
          <p className="text-white/60 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white rounded-2xl border border-[#e5ded3] p-8 md:p-12">
            {renderContent(content)}
          </div>
        </div>
      </section>
    </div>
  );
}
