"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/src/lib/api-helpers/client";
import { API, ROUTES } from "@/src/lib/url-helpers";
import { createLeadSchema, expressInterestSchema } from "@/src/lib/validators";
import type { CreateLeadInput, ExpressInterestInput } from "@/src/lib/validators";

export interface ActionResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

export async function submitLead(input: CreateLeadInput): Promise<ActionResult> {
  const parsed = createLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const data = await apiClient({ path: API.LEADS.LIST, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.SUBMIT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to submit" };
  }
}

export async function expressInterest(
  projectId: number,
  input: ExpressInterestInput,
): Promise<ActionResult> {
  const parsed = expressInterestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const data = await apiClient({
      path: API.PROJECTS.INTERESTS(projectId),
      method: "POST",
      body: parsed.data,
    });
    revalidatePath(ROUTES.PROJECTS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to submit" };
  }
}
