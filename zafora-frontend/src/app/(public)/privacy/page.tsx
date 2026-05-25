import { apiClient } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import LegalPageView from "@/src/modules/public/legal/components/LegalPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Zafora Holding",
  description: "Zafora Holding's Privacy Policy — how we collect, use, and protect your information.",
};

const DEFAULT = {
  title: "Privacy Policy",
  lastUpdated: "January 2025",
  content: "Zafora Holding is committed to protecting your privacy. This policy explains how we collect and use your information when you visit our website.\n\nWe collect information you voluntarily provide (name, email, company) and usage data. We use it to respond to inquiries and improve our services. We do not sell your personal data.\n\nContact us at Office@zaforaholding.com with any questions.",
};

export default async function PrivacyPage() {
  let page = { ...DEFAULT };
  try {
    const setting = await apiClient<{ key: string; value: string }>({ path: API.CONTENT.SETTINGS("legal_privacy") });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      page = { ...DEFAULT, ...parsed };
    }
  } catch {}

  return <LegalPageView icon="Shield" title={page.title} lastUpdated={page.lastUpdated} content={page.content} />;
}
