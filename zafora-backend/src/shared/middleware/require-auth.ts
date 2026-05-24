import { type Request, type Response, type NextFunction } from "express";
import { getSessionUser } from "@/modules/auth/auth.service.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getSessionUser(req.session as unknown as Record<string, unknown>);
  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
