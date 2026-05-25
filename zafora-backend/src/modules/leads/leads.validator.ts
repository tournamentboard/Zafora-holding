import { z } from "zod/v4";

export const CreateLeadBody = z.object({
  fullName: z.string().min(2),
  organization: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullish(),
  country: z.string().min(1),
  requestType: z.string().min(1),
  projectSector: z.string().nullish(),
  message: z.string().min(10),
  budgetFundingNeed: z.string().nullish(),
  projectTimeline: z.string().nullish(),
  roleType: z.string().nullish(),
});

export const UpdateLeadBody = z.object({
  status: z.string().optional(),
  notes: z.string().nullish(),
  followUpDate: z.string().nullish(),
});

export const ListLeadsQuery = z.object({
  status: z.string().optional(),
  requestType: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateLeadBodyType = z.infer<typeof CreateLeadBody>;
export type UpdateLeadBodyType = z.infer<typeof UpdateLeadBody>;
export type ListLeadsQueryType = z.infer<typeof ListLeadsQuery>;
