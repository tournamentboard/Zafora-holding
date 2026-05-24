import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { Lead } from "@/src/lib/types";
import type { UpdateLeadInput } from "@/src/lib/validators";

type ListLeadsParams = { status?: string; requestType?: string; page?: number; limit?: number };
type ListLeadsResponse = { leads: Lead[]; total: number };

async function fetchLeads(params?: ListLeadsParams): Promise<ListLeadsResponse> {
  const res = await apiAxios.get<ListLeadsResponse>(API.LEADS.LIST, { params });
  return res.data;
}

async function updateLead(id: number, data: UpdateLeadInput): Promise<Lead> {
  const res = await apiAxios.patch<Lead>(API.LEADS.BY_ID(id), data);
  return res.data;
}

export const leadsKeys = {
  all: ["leads"] as const,
  list: (params?: ListLeadsParams) => [...leadsKeys.all, "list", params] as const,
};

export function useLeads(params?: ListLeadsParams) {
  return useQuery({
    queryKey: leadsKeys.list(params),
    queryFn: () => fetchLeads(params),
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadInput }) =>
      updateLead(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadsKeys.all }),
  });
}
