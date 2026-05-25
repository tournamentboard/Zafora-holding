import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().default("Briefcase"),
  description: z.string().min(1, "Description is required"),
  bullets: z.array(z.string()).default([]),
  imageUrl: z.string().url().nullable().optional(),
  category: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
