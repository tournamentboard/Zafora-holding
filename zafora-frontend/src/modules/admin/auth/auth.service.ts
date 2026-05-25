import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { LoginFormValues } from "./auth.validator";

export interface LoginResponse {
  ok: boolean;
  user?: { id: number; email: string; role: string };
}

export async function loginAdmin(data: LoginFormValues): Promise<LoginResponse> {
  const res = await apiAxios.post<LoginResponse>(API.AUTH.LOGIN, { password: data.password });
  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  await apiAxios.post(API.AUTH.LOGOUT);
}
