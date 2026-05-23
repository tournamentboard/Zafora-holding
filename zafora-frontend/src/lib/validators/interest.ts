import { z } from "zod";

export const expressInterestSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  organization: z.string().min(1, "Organization is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().nullable().optional(),
  roleType: z.string().min(1, "Role type is required"),
  message: z.string().nullable().optional(),
});

export type ExpressInterestInput = z.infer<typeof expressInterestSchema>;
