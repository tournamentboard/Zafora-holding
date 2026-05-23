import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type {
  ContentStat,
  MethodologyStep,
  Service,
  SiteSetting,
} from "@/src/lib/api-client-react/generated/api.schemas";

async function fetchServices(): Promise<{ services: Service[] }> {
  const res = await apiAxios.get<{ services: Service[] }>(API.SERVICES.LIST);
  return res.data;
}

async function fetchContentStats(): Promise<{ stats: ContentStat[] }> {
  const res = await apiAxios.get<{ stats: ContentStat[] }>(
    API.CONTENT.STATS,
  );
  return res.data;
}

async function fetchMethodologySteps(): Promise<{ steps: MethodologyStep[] }> {
  const res = await apiAxios.get<{ steps: MethodologyStep[] }>(
    API.CONTENT.METHODOLOGY,
  );
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

export function useServices() {
  return useQuery({ queryKey: homeKeys.services, queryFn: fetchServices });
}

export function useContentStats() {
  return useQuery({ queryKey: homeKeys.stats, queryFn: fetchContentStats });
}

export function useMethodologySteps() {
  return useQuery({
    queryKey: homeKeys.methodology,
    queryFn: fetchMethodologySteps,
  });
}

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: homeKeys.setting(key),
    queryFn: () => fetchSiteSetting(key),
  });
}
