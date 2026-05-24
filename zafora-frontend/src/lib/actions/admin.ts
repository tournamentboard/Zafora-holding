"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/src/lib/api-helpers/client";
import { requireAdmin } from "@/src/lib/auth";
import { API, ROUTES } from "@/src/lib/url-helpers";
import {
  updateLeadSchema,
  createProjectSchema,
  updateProjectSchema,
  createDocumentSchema,
  updateDocumentSchema,
  createServiceSchema,
  updateServiceSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  createContentStatSchema,
  updateContentStatSchema,
  createMethodologyStepSchema,
  updateMethodologyStepSchema,
} from "@/src/lib/validators";
import type {
  UpdateLeadInput,
  CreateProjectInput,
  UpdateProjectInput,
  CreateDocumentInput,
  UpdateDocumentInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  CreateContentStatInput,
  UpdateContentStatInput,
  CreateMethodologyStepInput,
  UpdateMethodologyStepInput,
} from "@/src/lib/validators";

export interface ActionResult<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

// ── Leads ─────────────────────────────────────────────────────────

export async function updateLead(id: number, input: UpdateLeadInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateLeadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.LEADS.BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.LEADS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update lead" };
  }
}

// ── Projects ──────────────────────────────────────────────────────

export async function createProject(input: CreateProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.PROJECTS.LIST, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.PROJECTS);
    revalidatePath(ROUTES.PROJECTS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create project" };
  }
}

export async function updateProject(id: number, input: UpdateProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.PROJECTS.BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.PROJECTS);
    revalidatePath(ROUTES.PROJECTS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update project" };
  }
}

export async function deleteProject(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.PROJECTS.BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.PROJECTS);
    revalidatePath(ROUTES.PROJECTS);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete project" };
  }
}

// ── Documents ─────────────────────────────────────────────────────

export async function createDocument(input: CreateDocumentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createDocumentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.DOCUMENTS.LIST, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.DOCUMENTS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create document" };
  }
}

export async function updateDocument(id: number, input: UpdateDocumentInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateDocumentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.DOCUMENTS.BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.DOCUMENTS);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update document" };
  }
}

export async function deleteDocument(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.DOCUMENTS.BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.DOCUMENTS);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete document" };
  }
}

// ── Services ──────────────────────────────────────────────────────

export async function createService(input: CreateServiceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createServiceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.SERVICES.LIST, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    revalidatePath(ROUTES.SERVICES);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create service" };
  }
}

export async function updateService(id: number, input: UpdateServiceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateServiceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.SERVICES.BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    revalidatePath(ROUTES.SERVICES);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update service" };
  }
}

export async function deleteService(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.SERVICES.BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    revalidatePath(ROUTES.SERVICES);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete service" };
  }
}

// ── Testimonials ──────────────────────────────────────────────────

export async function createTestimonial(input: CreateTestimonialInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createTestimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.TESTIMONIALS.LIST, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create testimonial" };
  }
}

export async function updateTestimonial(id: number, input: UpdateTestimonialInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateTestimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.TESTIMONIALS.BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update testimonial" };
  }
}

export async function deleteTestimonial(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.TESTIMONIALS.BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete testimonial" };
  }
}

// ── Content Stats ─────────────────────────────────────────────────

export async function createContentStat(input: CreateContentStatInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createContentStatSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.CONTENT.STATS, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create stat" };
  }
}

export async function updateContentStat(id: number, input: UpdateContentStatInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateContentStatSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.CONTENT.STATS_BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update stat" };
  }
}

export async function deleteContentStat(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.CONTENT.STATS_BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete stat" };
  }
}

// ── Methodology Steps ─────────────────────────────────────────────

export async function createMethodologyStep(input: CreateMethodologyStepInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = createMethodologyStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.CONTENT.METHODOLOGY, method: "POST", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create step" };
  }
}

export async function updateMethodologyStep(id: number, input: UpdateMethodologyStepInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateMethodologyStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  try {
    const data = await apiClient({ path: API.CONTENT.METHODOLOGY_BY_ID(id), method: "PATCH", body: parsed.data });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update step" };
  }
}

export async function deleteMethodologyStep(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.CONTENT.METHODOLOGY_BY_ID(id), method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete step" };
  }
}

// ── Site Settings ─────────────────────────────────────────────────

export async function updateSiteSetting(key: string, value: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const data = await apiClient({
      path: API.CONTENT.SETTINGS(key),
      method: "PATCH",
      body: { value },
    });
    revalidatePath(ROUTES.ADMIN.CONTENT);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update setting" };
  }
}

// ── Audit ─────────────────────────────────────────────────────────

export async function clearAuditLogs(): Promise<ActionResult> {
  await requireAdmin();
  try {
    await apiClient({ path: API.AUDIT.LIST, method: "DELETE" });
    revalidatePath(ROUTES.ADMIN.AUDIT);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to clear audit logs" };
  }
}
