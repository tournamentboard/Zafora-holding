import { Router, type IRouter, type Request, type Response } from "express";
import { requireAuth } from "@/shared/middleware/require-auth.js";
import { getPresignedPutUrl } from "@/shared/lib/object-storage.js";
import { PresignBody } from "./storage.validator.js";
import { ROUTE_PATHS } from "@/shared/url-helpers/route-paths.js";

const router: IRouter = Router();

router.post(
  ROUTE_PATHS.STORAGE.PRESIGN,
  requireAuth,
  async (req: Request, res: Response) => {
    const parsed = PresignBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0]?.message ?? "Invalid request body",
      });
      return;
    }

    const { fileName, contentType, folder } = parsed.data;

    try {
      const result = await getPresignedPutUrl(folder, fileName, contentType);
      res.json(result);
    } catch (error) {
      req.log.error({ err: error }, "Failed to generate presigned URL");
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  },
);

export { router as storageRouter };
