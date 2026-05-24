import { useQuery } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type {
  Project,
  ProjectInterest,
} from "@/src/lib/api-client-react/generated/api.schemas";

export type ListProjectsParams = {
  sector?: string;
  status?: string;
  search?: string;
  limit?: number;
  country?: string;
};

export type ListProjectsResponse = { projects: Project[]; total: number };
export type ListInterestsResponse = { interests: ProjectInterest[] };

async function fetchProjects(
  params?: ListProjectsParams,
): Promise<ListProjectsResponse> {
  const res = await apiAxios.get<ListProjectsResponse>(API.PROJECTS.LIST, {
    params,
  });
  return res.data;
}

async function fetchProjectInterests(
  projectId: number,
): Promise<ListInterestsResponse> {
  const res = await apiAxios.get<ListInterestsResponse>(
    API.PROJECTS.INTERESTS(projectId),
  );
  return res.data;
}

export const projectKeys = {
  all: ["projects"] as const,
  list: (params?: ListProjectsParams) =>
    [...projectKeys.all, "list", params] as const,
  interests: (id: number) => [...projectKeys.all, "interests", id] as const,
};

export function useProjects(params?: ListProjectsParams) {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => fetchProjects(params),
  });
}

export function useProjectInterests(projectId: number) {
  return useQuery({
    queryKey: projectKeys.interests(projectId),
    queryFn: () => fetchProjectInterests(projectId),
    enabled: projectId > 0,
  });
}
