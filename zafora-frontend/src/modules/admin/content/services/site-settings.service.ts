import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";

type SiteSettingResponse = { key: string; value: string | null };

export const siteSettingsKeys = {
  all: ["admin", "content", "site-settings"] as const,
  single: (key: string) => [...siteSettingsKeys.all, key] as const,
};

/** Fetch a single site setting by key. */
export function useGetSiteSettings(key: string) {
  return useQuery({
    queryKey: siteSettingsKeys.single(key),
    queryFn: async () => {
      const res = await apiAxios.get<SiteSettingResponse>(API.CONTENT.SETTINGS(key));
      return res.data;
    },
    enabled: !!key,
  });
}

/** Update a site setting. Accepts `{ key, data: { value } }` to match original hook shape. */
export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: { value: string } }) =>
      apiAxios.patch<SiteSettingResponse>(API.CONTENT.SETTINGS(key), { value: data.value }).then((r) => r.data),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: siteSettingsKeys.single(vars.key) });
    },
  });
}
