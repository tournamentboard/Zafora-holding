import { z } from "zod/v4";

export const CreateFaqBody = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().default("general"),
  page: z.string().default("general"),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const UpdateFaqBody = CreateFaqBody.partial();

export type CreateFaqBodyType = z.infer<typeof CreateFaqBody>;
export type UpdateFaqBodyType = z.infer<typeof UpdateFaqBody>;
