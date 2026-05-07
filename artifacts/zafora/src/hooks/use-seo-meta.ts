import { useEffect } from "react";

export interface SeoSettings {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
}

const SITE_NAME = "Zafora Holding";

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}


export function useSeoMeta(pageTitle: string, seo?: SeoSettings) {
  useEffect(() => {
    const resolvedTitle = seo?.title || (pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME);
    const resolvedDesc = seo?.description || "";
    const resolvedOgTitle = seo?.ogTitle || resolvedTitle;
    const resolvedOgDesc = seo?.ogDescription || resolvedDesc;
    const resolvedOgImage = seo?.ogImage || "";

    document.title = resolvedTitle;

    if (resolvedDesc) setMetaTag("name", "description", resolvedDesc);
    setMetaTag("property", "og:title", resolvedOgTitle);
    if (resolvedOgDesc) setMetaTag("property", "og:description", resolvedOgDesc);
    if (resolvedOgImage) setMetaTag("property", "og:image", resolvedOgImage);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:type", "website");
    setMetaTag("name", "twitter:card", seo?.twitterCard || "summary_large_image");
    if (resolvedOgTitle) setMetaTag("name", "twitter:title", resolvedOgTitle);
    if (resolvedOgDesc) setMetaTag("name", "twitter:description", resolvedOgDesc);
    if (resolvedOgImage) setMetaTag("name", "twitter:image", resolvedOgImage);

    return () => {
      document.title = SITE_NAME;
    };
  }, [pageTitle, seo?.title, seo?.description, seo?.ogTitle, seo?.ogDescription, seo?.ogImage]);
}

export function parseSeoSettings(data: any): SeoSettings | undefined {
  if (!data?.value) return undefined;
  try {
    const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
    return {
      title: parsed.title || "",
      description: parsed.description || "",
      ogTitle: parsed.ogTitle || "",
      ogDescription: parsed.ogDescription || "",
      ogImage: parsed.ogImage || "",
    };
  } catch {
    return undefined;
  }
}
