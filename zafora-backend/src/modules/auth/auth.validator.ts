import { z } from "zod/v4";

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ChangePasswordBody = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const SetupBody = z.object({
  adminEmail: z.string().email(),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const ResetPasswordBody = z.object({
  adminEmail: z.string().email(),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type LoginBodyType = z.infer<typeof LoginBody>;
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBody>;
export type SetupBodyType = z.infer<typeof SetupBody>;
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
