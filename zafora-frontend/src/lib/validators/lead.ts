import { z } from "zod";

export const createLeadSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  organization: z.string().min(1, "Organization is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().nullable().optional(),
  country: z.string().min(1, "Country is required"),
  requestType: z.string().min(1, "Request type is required"),
  projectSector: z.string().nullable().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  budgetFundingNeed: z.string().nullable().optional(),
  projectTimeline: z.string().nullable().optional(),
  roleType: z.string().nullable().optional(),
});

export const updateLeadSchema = z.object({
  status: z.string().optional(),
  notes: z.string().nullable().optional(),
  followUpDate: z.string().nullable().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
