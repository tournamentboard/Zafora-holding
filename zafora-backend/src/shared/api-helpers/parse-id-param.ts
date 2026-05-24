import { type Request, type Response } from "express";

export function parseIdParam(req: Request, res: Response): number | null {
  const raw = req.params["id"];
  const idStr = Array.isArray(raw) ? raw[0] : raw;
  const id = parseInt(idStr ?? "", 10);
  if (Number.isNaN(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return null;
  }
  return id;
}
