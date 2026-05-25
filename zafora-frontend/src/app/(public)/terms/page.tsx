import { apiClient } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import LegalPageView from "@/src/modules/public/legal/components/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Zafora Holding",
  description: "Zafora Holding's Terms of Service — the terms governing use of our website.",
};

const DEFAULT = {
  title: "Terms of Service",
  lastUpdated: "January 2025",
  content: "By accessing this website you agree to these Terms of Service.\n\nAll content on this site is the property of Zafora Holding and protected by applicable laws. You may use this site for lawful purposes only.\n\nZafora Holding shall not be liable for any indirect or consequential damages arising from use of this site.\n\nContact us at Office@zaforaholding.com with any questions.",
};

export default async function TermsPage() {
  let page = { ...DEFAULT };
  try {
    const setting = await apiClient<{ key: string; value: string }>({ path: API.CONTENT.SETTINGS("legal_terms") });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      page = { ...DEFAULT, ...parsed };
    }
  } catch {}

  return <LegalPageView icon="FileText" title={page.title} lastUpdated={page.lastUpdated} content={page.content} />;
}
