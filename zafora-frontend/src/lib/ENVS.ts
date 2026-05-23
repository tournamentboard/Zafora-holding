export { ENV } from "@/src/lib/constants/env";

/** @deprecated Use ENV from @/src/lib/constants */
export const ENVS_VARIABLES = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
  API_URL: process.env.NEXT_PUBLIC_API_URL!,
};
