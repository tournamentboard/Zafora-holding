import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { ExpressInterestInput } from "@/src/lib/validators";
import type { ProjectInterest } from "@/src/lib/types";

async function postInterest(projectId: number, data: ExpressInterestInput): Promise<ProjectInterest> {
  const res = await apiAxios.post<ProjectInterest>(API.PROJECTS.INTERESTS(projectId), data);
  return res.data;
}

export function useExpressInterestMutation(projectId: number) {
  return useMutation({
    mutationFn: (data: ExpressInterestInput) => postInterest(projectId, data),
  });
}
