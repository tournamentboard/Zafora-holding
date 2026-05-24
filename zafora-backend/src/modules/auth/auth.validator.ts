import { z } from "zod/v4";

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ChangePasswordBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type LoginBodyType = z.infer<typeof LoginBody>;
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>;
