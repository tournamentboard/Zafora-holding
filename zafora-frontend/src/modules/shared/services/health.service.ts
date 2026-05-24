import { apiClient } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { HealthStatus } from "@/src/lib/types";

export async function getHealthStatus(): Promise<HealthStatus> {
  return apiClient<HealthStatus>({
    path: API.HEALTH.CHECK,
    cache: "no-store",
  });
}
