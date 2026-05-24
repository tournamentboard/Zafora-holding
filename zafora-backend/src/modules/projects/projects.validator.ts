import { z } from "zod/v4";

export const CreateProjectBody = z.object({
  name: z.string().min(2),
  sector: z.string().min(1),
  country: z.string().min(1),
  region: z.string().nullish(),
  fundingStatus: z.string().min(1),
  estimatedValue: z.string().min(1),
  zaforaRole: z.string().min(1),
  partnerNeed: z.string().nullish(),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullish(),
});

export const UpdateProjectBody = CreateProjectBody.partial();

export const ListProjectsQuery = z.object({
  sector: z.string().optional(),
  status: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const ExpressInterestBody = z.object({
  fullName: z.string().min(2),
  organization: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullish(),
  roleType: z.string().min(1),
  message: z.string().nullish(),
});

export type CreateProjectBodyType = z.infer<typeof CreateProjectBody>;
export type UpdateProjectBodyType = z.infer<typeof UpdateProjectBody>;
export type ListProjectsQueryType = z.infer<typeof ListProjectsQuery>;
export type ExpressInterestBodyType = z.infer<typeof ExpressInterestBody>;
