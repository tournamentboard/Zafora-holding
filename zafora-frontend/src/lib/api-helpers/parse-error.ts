import type { ApiErrorBody } from "@/src/lib/types";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: ApiErrorBody | null;

  constructor(
    status: number,
    statusText: string,
    body: ApiErrorBody | null,
    message?: string,
  ) {
    super(
      message ??
        body?.detail ??
        body?.message ??
        body?.title ??
        `Request failed with status ${status}`,
    );
    this.name = "ApiRequestError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export async function parseApiError(response: Response): Promise<ApiRequestError> {
  let body: ApiErrorBody | null = null;

  try {
    const text = await response.text();
    if (text) {
      body = JSON.parse(text) as ApiErrorBody;
    }
  } catch {
    body = null;
  }

  return new ApiRequestError(response.status, response.statusText, body);
}
