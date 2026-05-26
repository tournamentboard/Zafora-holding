import { apiClient } from "@/src/lib/api-helpers/client";
import { API } from "@/src/lib/url-helpers";

type SectionMap = Record<string, boolean>;
type VisibilityConfig = Record<string, SectionMap>;

const VISIBILITY_DEFAULTS: VisibilityConfig = {
  home: { hero: true, ticker: true, stats: true, services: true, methodology: true, testimonial: true, projects: true, sectors: true, cta: true },
  about: { hero: true, stats: true, story: true, mvp: true, values: true, team: true, timeline: true, cta: true },
  services: { hero: true, stats: true, cards: true, cta: true },
  projects: { hero: true, filter: true, grid: true },
  government: { hero: true, stats: true, capability: true, framework: true, cta: true },
  submit: { hero: true, form: true, sidebar: true },
};

export async function getSectionVisibility(page: string): Promise<SectionMap> {
  try {
    const data = await apiClient<{ key: string; value: string }>({
      path: API.CONTENT.SETTINGS("section_visibility"),
    });
    const parsed: VisibilityConfig = data?.value ? JSON.parse(data.value) : {};
    return { ...(VISIBILITY_DEFAULTS[page] ?? {}), ...(parsed[page] ?? {}) };
  } catch {
    return VISIBILITY_DEFAULTS[page] ?? {};
  }
}

export function isSectionVisible(visibility: SectionMap, section: string): boolean {
  return visibility[section] !== false;
}
