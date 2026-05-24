import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { Project } from "@/src/lib/types";
import type { CreateProjectInput, UpdateProjectInput } from "@/src/lib/validators";

type ListProjectsParams = { sector?: string; status?: string; search?: string; limit?: number; page?: number };
type ListProjectsResponse = { projects: Project[]; total: number };

async function fetchProjects(params?: ListProjectsParams): Promise<ListProjectsResponse> {
  const res = await apiAxios.get<ListProjectsResponse>(API.PROJECTS.LIST, { params });
  return res.data;
}

async function createProject(data: CreateProjectInput): Promise<Project> {
  const res = await apiAxios.post<Project>(API.PROJECTS.LIST, data);
  return res.data;
}

async function updateProject(id: number, data: UpdateProjectInput): Promise<Project> {
  const res = await apiAxios.patch<Project>(API.PROJECTS.BY_ID(id), data);
  return res.data;
}

async function deleteProject(id: number): Promise<void> {
  await apiAxios.delete(API.PROJECTS.BY_ID(id));
}

export const adminProjectKeys = {
  all: ["admin", "projects"] as const,
  list: (params?: ListProjectsParams) =>
    [...adminProjectKeys.all, "list", params] as const,
};

export function useAdminProjects(params?: ListProjectsParams) {
  return useQuery({
    queryKey: adminProjectKeys.list(params),
    queryFn: () => fetchProjects(params),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminProjectKeys.all }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectInput }) =>
      updateProject(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminProjectKeys.all }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminProjectKeys.all }),
  });
}
