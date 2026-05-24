import { z } from "zod/v4";

export const CreateTestimonialBody = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  role: z.string().nullish(),
  quote: z.string().min(1),
  photoUrl: z.string().url().nullish(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const UpdateTestimonialBody = CreateTestimonialBody.partial();

export type CreateTestimonialBodyType = z.infer<typeof CreateTestimonialBody>;
export type UpdateTestimonialBodyType = z.infer<typeof UpdateTestimonialBody>;
