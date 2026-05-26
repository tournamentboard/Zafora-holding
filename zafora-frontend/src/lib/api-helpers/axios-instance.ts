import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API } from "@/src/lib/url-helpers";

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export const apiAxios = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Token helpers ─────────────────────────────────────────────────

const IS_SECURE = process.env.NODE_ENV === "production";

export function storeTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
  // Non-httpOnly cookies so Next.js middleware and server components can read them
  const secure = IS_SECURE ? "; Secure" : "";
  document.cookie = `access_token=${accessToken}; path=/; max-age=900; SameSite=Lax${secure}`;
  document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800; SameSite=Lax${secure}`;
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

// ── Request interceptor — attach Bearer token ─────────────────────

apiAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ───────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
}

apiAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error?.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error?.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest?.url !== API.AUTH.REFRESH &&
      originalRequest?.url !== API.AUTH.LOGIN
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiAxios(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Send refreshToken in body — backend accepts both body and cookie
        const resp = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${BACKEND}${API.AUTH.REFRESH}`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );
        storeTokens(resp.data.accessToken, resp.data.refreshToken);
        processQueue(null);
        return apiAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message: string =
      error?.response?.data?.message ??
      error?.response?.data?.detail ??
      error?.response?.data?.error ??
      error?.message ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export type { AxiosRequestConfig };
