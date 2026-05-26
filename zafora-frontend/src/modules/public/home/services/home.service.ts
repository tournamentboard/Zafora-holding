import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { ContentStat, MethodologyStep, CatalogService, SiteSetting } from "@/src/lib/types";

async function fetchServices(): Promise<{ services: CatalogService[] }> {
  const res = await apiAxios.get<{ services: CatalogService[] }>(API.SERVICES.LIST);
  return res.data;
}

async function fetchContentStats(): Promise<{ stats: ContentStat[] }> {
  const res = await apiAxios.get<{ stats: ContentStat[] }>(API.CONTENT.STATS);
  return res.data;
}

async function fetchMethodologySteps(): Promise<{ steps: MethodologyStep[] }> {
  const res = await apiAxios.get<{ steps: MethodologyStep[] }>(API.CONTENT.METHODOLOGY);
  return res.data;
}

async function fetchSiteSetting(key: string): Promise<SiteSetting> {
  const res = await apiAxios.get<SiteSetting>(API.CONTENT.SETTINGS(key));
  return res.data;
}

export const homeKeys = {
  services: ["services"] as const,
  stats: ["content", "stats"] as const,
  methodology: ["content", "methodology"] as const,
  setting: (key: string) => ["content", "settings", key] as const,
};

type SectionMap = Record<string, boolean>;

const VISIBILITY_DEFAULTS: Record<string, SectionMap> = {
  home: { hero: true, ticker: true, stats: true, services: true, methodology: true, testimonial: true, projects: true, sectors: true, cta: true },
  about: { hero: true, stats: true, story: true, mvp: true, values: true, team: true, timeline: true, cta: true },
  services: { hero: true, stats: true, cards: true, cta: true },
  projects: { hero: true, filter: true, grid: true },
  government: { hero: true, stats: true, capability: true, framework: true, cta: true },
  submit: { hero: true, form: true, sidebar: true },
};

export function useSectionVisibility(page: string): SectionMap {
  const { data } = useSiteSetting("section_visibility");
  try {
    const parsed: Record<string, SectionMap> = data?.value ? JSON.parse(data.value as string) : {};
    return { ...(VISIBILITY_DEFAULTS[page] ?? {}), ...(parsed[page] ?? {}) };
  } catch {
    return VISIBILITY_DEFAULTS[page] ?? {};
  }
}

export function isSectionVisible(visibility: SectionMap, section: string): boolean {
  return visibility[section] !== false;
}

export function useServices() {
  return useQuery({ queryKey: homeKeys.services, queryFn: fetchServices });
}

export function useContentStats() {
  return useQuery({ queryKey: homeKeys.stats, queryFn: fetchContentStats });
}

export function useMethodologySteps() {
  return useQuery({ queryKey: homeKeys.methodology, queryFn: fetchMethodologySteps });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: homeKeys.setting(key),
    queryFn: () => fetchSiteSetting(key),
  });
}
