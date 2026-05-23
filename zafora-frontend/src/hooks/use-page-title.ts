import { useSeoMeta, type SeoSettings } from "./use-seo-meta";

export function usePageTitle(title: string, seo?: SeoSettings) {
  useSeoMeta(title, seo);
}

export { useSeoMeta } from "./use-seo-meta";
