import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { DashboardStats, ProjectStats } from "@/src/lib/types";

export const statsKeys = {
  all: ["admin", "stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
  projects: () => [...statsKeys.all, "projects"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: async () => {
      const res = await apiAxios.get<DashboardStats>(API.STATS.ROOT);
      return res.data;
    },
  });
}

export function useProjectStats() {
  return useQuery({
    queryKey: statsKeys.projects(),
    queryFn: async () => {
      const res = await apiAxios.get<ProjectStats>(API.STATS.PROJECTS);
      return res.data;
    },
  });
}
