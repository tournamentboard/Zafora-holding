import { type Request, type Response, type NextFunction } from "express";
import {
  verifyAccessToken,
  ACCESS_COOKIE,
  type TokenPayload,
} from "@/modules/auth/auth.tokens.js";

export interface AuthenticatedRequest extends Request {
  authUser: TokenPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.cookies as Record<string, string | undefined>)?.[ACCESS_COOKIE];

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  (req as AuthenticatedRequest).authUser = payload;
  next();
}
