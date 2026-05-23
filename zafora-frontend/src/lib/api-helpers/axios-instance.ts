import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { ENV } from "@/src/lib/constants";

export const apiAxios = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
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
