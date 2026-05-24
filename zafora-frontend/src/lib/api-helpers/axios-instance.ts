import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API } from "@/src/lib/url-helpers";

// Use relative base URL so all client requests flow through the Next.js rewrite
// proxy (/api/* → backend). This ensures httpOnly cookies are scoped to the
// frontend domain, making them readable by Next.js middleware.
export const apiAxios = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

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

    // Auto-refresh on 401, but skip the refresh endpoint itself to avoid loops
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

      try {
        await apiAxios.post(API.AUTH.REFRESH);
        processQueue(null);
        return apiAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed — redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
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
