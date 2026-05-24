import { ENV } from "@/src/lib/constants";
import { parseApiError } from "@/src/lib/api-helpers/parse-error";

export type ApiClientOptions = Omit<RequestInit, "body"> & {
  path: string;
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  /** Next.js fetch cache options */
  next?: NextFetchRequestConfig;
};

function buildApiUrl(
  path: string,
  searchParams?: ApiClientOptions["searchParams"],
): string {
  const base = path.startsWith("http") ? path : `${ENV.API_URL}${path}`;
  const url = new URL(base);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export async function apiClient<T>(
  options: ApiClientOptions,
): Promise<T> {
  const { path, body, searchParams, headers, ...init } = options;
  const url = buildApiUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
