import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  sector: z.string().min(1, "Sector is required"),
  country: z.string().min(1, "Country is required"),
  region: z.string().nullable().optional(),
  fundingStatus: z.string().min(1, "Funding status is required"),
  estimatedValue: z.string().min(1, "Estimated value is required"),
  zaforaRole: z.string().min(1, "Zafora role is required"),
  partnerNeed: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
