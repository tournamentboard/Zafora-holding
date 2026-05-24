import { type Request, type Response, type NextFunction } from "express";
import { logger } from "@/shared/lib/logger.js";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error(err, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}
