import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { AuditLog } from "@/src/lib/types";

type ListAuditLogsResponse = { logs: AuditLog[] };

export const auditKeys = {
  all: ["admin", "audit"] as const,
  list: (limit?: number) => [...auditKeys.all, "list", limit] as const,
};

export function useAuditLogs(limit = 50) {
  return useQuery({
    queryKey: auditKeys.list(limit),
    queryFn: async () => {
      const res = await apiAxios.get<ListAuditLogsResponse>(API.AUDIT.LIST, {
        params: { limit },
      });
      return res.data.logs;
    },
  });
}

export function useClearAuditLogs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiAxios.delete(API.AUDIT.LIST),
    onSuccess: () => qc.invalidateQueries({ queryKey: auditKeys.all }),
  });
}
