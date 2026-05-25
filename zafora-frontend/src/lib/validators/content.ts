import { z } from "zod";

export const createContentStatSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  suffix: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  iconName: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateContentStatSchema = createContentStatSchema.partial();

export const createMethodologyStepSchema = z.object({
  stepNumber: z.number().int().min(1, "Step number is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateMethodologyStepSchema = createMethodologyStepSchema.partial();

export type CreateContentStatInput = z.infer<typeof createContentStatSchema>;
export type UpdateContentStatInput = z.infer<typeof updateContentStatSchema>;
export type CreateMethodologyStepInput = z.infer<typeof createMethodologyStepSchema>;
export type UpdateMethodologyStepInput = z.infer<typeof updateMethodologyStepSchema>;
