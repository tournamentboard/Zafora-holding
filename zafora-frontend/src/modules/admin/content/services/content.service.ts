import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { ContentStat, MethodologyStep, SiteSetting, CatalogService, Testimonial } from "@/src/lib/types";
import type {
  CreateContentStatInput,
  UpdateContentStatInput,
  CreateMethodologyStepInput,
  UpdateMethodologyStepInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateTestimonialInput,
  UpdateTestimonialInput,
} from "@/src/lib/validators";

export const contentKeys = {
  all: ["admin", "content"] as const,
  stats: () => [...contentKeys.all, "stats"] as const,
  methodology: () => [...contentKeys.all, "methodology"] as const,
  setting: (key: string) => [...contentKeys.all, "settings", key] as const,
  services: () => [...contentKeys.all, "services"] as const,
  testimonials: () => [...contentKeys.all, "testimonials"] as const,
};

// ── Content Stats ─────────────────────────────────────────────────

export function useContentStats() {
  return useQuery({
    queryKey: contentKeys.stats(),
    queryFn: async () => {
      const res = await apiAxios.get<{ stats: ContentStat[] }>(API.CONTENT.STATS);
      return res.data.stats;
    },
  });
}

export function useCreateContentStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentStatInput) =>
      apiAxios.post<ContentStat>(API.CONTENT.STATS, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.stats() }),
  });
}

export function useUpdateContentStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContentStatInput }) =>
      apiAxios.patch<ContentStat>(API.CONTENT.STATS_BY_ID(id), data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.stats() }),
  });
}

export function useDeleteContentStat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiAxios.delete(API.CONTENT.STATS_BY_ID(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.stats() }),
  });
}

// ── Methodology Steps ─────────────────────────────────────────────

export function useMethodologySteps() {
  return useQuery({
    queryKey: contentKeys.methodology(),
    queryFn: async () => {
      const res = await apiAxios.get<{ steps: MethodologyStep[] }>(API.CONTENT.METHODOLOGY);
      return res.data.steps;
    },
  });
}

export function useCreateMethodologyStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMethodologyStepInput) =>
      apiAxios.post<MethodologyStep>(API.CONTENT.METHODOLOGY, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.methodology() }),
  });
}

export function useUpdateMethodologyStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMethodologyStepInput }) =>
      apiAxios.patch<MethodologyStep>(API.CONTENT.METHODOLOGY_BY_ID(id), data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.methodology() }),
  });
}

export function useDeleteMethodologyStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiAxios.delete(API.CONTENT.METHODOLOGY_BY_ID(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.methodology() }),
  });
}

// ── Site Settings ─────────────────────────────────────────────────

export function useSiteSetting(key: string) {
  return useQuery({
    queryKey: contentKeys.setting(key),
    queryFn: async () => {
      const res = await apiAxios.get<SiteSetting>(API.CONTENT.SETTINGS(key));
      return res.data;
    },
  });
}

export function useUpdateSiteSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiAxios.patch<SiteSetting>(API.CONTENT.SETTINGS(key), { value }).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: contentKeys.setting(variables.key) });
    },
  });
}

// ── Services (catalog) ────────────────────────────────────────────

export function useAdminServices() {
  return useQuery({
    queryKey: contentKeys.services(),
    queryFn: async () => {
      const res = await apiAxios.get<{ services: CatalogService[] }>(API.SERVICES.LIST);
      return res.data.services;
    },
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceInput) =>
      apiAxios.post<CatalogService>(API.SERVICES.LIST, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.services() }),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceInput }) =>
      apiAxios.patch<CatalogService>(API.SERVICES.BY_ID(id), data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.services() }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiAxios.delete(API.SERVICES.BY_ID(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.services() }),
  });
}

// ── Testimonials ──────────────────────────────────────────────────

export function useAdminTestimonials() {
  return useQuery({
    queryKey: contentKeys.testimonials(),
    queryFn: async () => {
      const res = await apiAxios.get<{ testimonials: Testimonial[] }>(API.TESTIMONIALS.LIST);
      return res.data.testimonials;
    },
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTestimonialInput) =>
      apiAxios.post<Testimonial>(API.TESTIMONIALS.LIST, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.testimonials() }),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTestimonialInput }) =>
      apiAxios.patch<Testimonial>(API.TESTIMONIALS.BY_ID(id), data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.testimonials() }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiAxios.delete(API.TESTIMONIALS.BY_ID(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.testimonials() }),
  });
}
