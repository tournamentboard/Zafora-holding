import { apiClient } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import { Clock, Mail } from "lucide-react";
import Image from "next/image";
import logo from "@/src/assets/logo.png";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Maintenance — Zafora Holding" };

const DEFAULT = {
  headline: "We'll be back soon.",
  message: "We're performing scheduled maintenance. Please check back shortly.",
  showContactEmail: true,
  estimatedTime: "",
  contactEmail: "Office@zaforaholding.com",
};

export default async function MaintenancePage() {
  let mode = { ...DEFAULT };
  try {
    const setting = await apiClient<{ key: string; value: string }>({ path: API.CONTENT.SETTINGS("maintenance_mode") });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      mode = { ...DEFAULT, ...parsed };
    }
    // Also fetch contact email from footer settings
    const footer = await apiClient<{ key: string; value: string }>({ path: API.CONTENT.SETTINGS("footer") });
    if (footer?.value) {
      const parsed = JSON.parse(footer.value);
      if (parsed?.email) mode.contactEmail = parsed.email;
    }
  } catch {}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#f7f4ef" }}>
      <div className="w-full max-w-lg text-center">
        <Image
          src={logo}
          alt="Zafora Holding"
          className="h-24 w-auto mx-auto mb-10 opacity-80"
          style={{ imageRendering: "auto" }}
        />

        <div className="inline-flex items-center gap-2 bg-[#173f35]/10 text-[#173f35] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-8">
          <Clock size={11} /> Scheduled Maintenance
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-[#10231f] leading-tight mb-5">
          {mode.headline}
        </h1>

        <p className="text-[#65736f] text-base leading-relaxed mb-6">
          {mode.message}
        </p>

        {mode.estimatedTime && (
          <div className="inline-flex items-center gap-2 bg-white border border-[#e5ded3] rounded-xl px-4 py-2.5 text-sm text-[#10231f] font-medium mb-6">
            <Clock size={14} className="text-[#c59b4a]" />
            {mode.estimatedTime}
          </div>
        )}

        {mode.showContactEmail && mode.contactEmail && (
          <div className="mt-8 pt-8 border-t border-[#e5ded3]">
            <p className="text-xs text-[#8a958f] mb-2">Need urgent assistance?</p>
            <a
              href={`mailto:${mode.contactEmail}`}
              className="inline-flex items-center gap-2 text-sm text-[#173f35] font-semibold hover:underline"
            >
              <Mail size={14} />
              {mode.contactEmail}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
