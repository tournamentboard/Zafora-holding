import { z } from "zod/v4";

export const CreateServiceBody = z.object({
  name: z.string().min(1),
  icon: z.string().default("Briefcase"),
  description: z.string().min(1),
  bullets: z.array(z.string()).default([]),
  imageUrl: z.string().url().nullish(),
  category: z.string().nullish(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const UpdateServiceBody = CreateServiceBody.partial();

export type CreateServiceBodyType = z.infer<typeof CreateServiceBody>;
export type UpdateServiceBodyType = z.infer<typeof UpdateServiceBody>;
