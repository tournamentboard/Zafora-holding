import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().nullable().optional(),
  quote: z.string().min(1, "Quote is required"),
  photoUrl: z.string().url().nullable().optional(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
