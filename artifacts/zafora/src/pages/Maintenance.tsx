import logo from "@/assets/logo.png";
import { Mail, Clock } from "lucide-react";

type Props = {
  headline?: string;
  message?: string;
  estimatedTime?: string;
  contactEmail?: string;
};

export default function Maintenance({ headline, message, estimatedTime, contactEmail }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-lg text-center">
        <img src={logo} alt="Zafora Holding" className="h-16 w-auto mx-auto mb-10 opacity-80" />

        <div className="inline-flex items-center gap-2 bg-[#173f35]/10 text-[#173f35] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8">
          <Clock size={11} /> Scheduled Maintenance
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#10231f] leading-tight mb-5">
          {headline || "We'll be back soon."}
        </h1>

        <p className="text-[#65736f] text-base leading-relaxed mb-6">
          {message || "We're performing scheduled maintenance. Please check back shortly."}
        </p>

        {estimatedTime && (
          <div className="inline-flex items-center gap-2 bg-white border border-[#e5ded3] rounded-xl px-4 py-2.5 text-sm text-[#10231f] font-medium mb-6">
            <Clock size={14} className="text-[#c59b4a]" />
            {estimatedTime}
          </div>
        )}

        {contactEmail && (
          <div className="mt-8 pt-8 border-t border-[#e5ded3]">
            <p className="text-xs text-[#8a958f] mb-2">Need urgent assistance?</p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline"
            >
              <Mail size={14} />
              {contactEmail}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
