export const ENV = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
  API_URL: (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, ""),
} as const;
