export const ENV = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  API_URL: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
    /\/+$/,
    "",
  ),
} as const;
