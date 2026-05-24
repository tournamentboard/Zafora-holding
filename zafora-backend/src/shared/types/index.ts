import { type Request } from "express";

export interface AuthenticatedRequest extends Request {
  userId: number;
  userEmail: string;
  userRole: string;
}

export interface ApiErrorBody {
  error: string;
  details?: unknown;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
