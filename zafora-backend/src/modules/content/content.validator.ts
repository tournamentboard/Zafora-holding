import { z } from "zod/v4";

export const CreateContentStatBody = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  suffix: z.string().nullish(),
  description: z.string().nullish(),
  iconName: z.string().nullish(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const UpdateContentStatBody = CreateContentStatBody.partial();

export const CreateMethodologyStepBody = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().nullish(),
  displayOrder: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const UpdateMethodologyStepBody = CreateMethodologyStepBody.partial();

export const UpsertSettingBody = z.object({
  value: z.string(),
});

export type CreateContentStatBodyType = z.infer<typeof CreateContentStatBody>;
export type UpdateContentStatBodyType = z.infer<typeof UpdateContentStatBody>;
export type CreateMethodologyStepBodyType = z.infer<typeof CreateMethodologyStepBody>;
export type UpdateMethodologyStepBodyType = z.infer<typeof UpdateMethodologyStepBody>;
export type UpsertSettingBodyType = z.infer<typeof UpsertSettingBody>;
