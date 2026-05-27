import { z } from "zod";
import { ALLOWED_CONTENT_TYPES, MAX_FILE_SIZE_BYTES } from "@/shared/lib/object-storage.js";
import { ALLOWED_S3_FOLDERS } from "@/shared/constants/storage-folders.js";

export const PresignBody = z.object({
  fileName: z.string().min(1, "fileName is required"),
  contentType: z.string().refine(
    (ct): ct is typeof ALLOWED_CONTENT_TYPES[number] =>
      (ALLOWED_CONTENT_TYPES as readonly string[]).includes(ct),
    { message: "Unsupported content type. Allowed: jpeg, png, webp, gif, svg, pdf" },
  ),
  size: z
    .number()
    .int()
    .min(1, "File must be at least 1 byte")
    .max(MAX_FILE_SIZE_BYTES, "File exceeds 10 MB limit"),
  folder: z.enum(ALLOWED_S3_FOLDERS, {
    error: `folder must be one of: ${ALLOWED_S3_FOLDERS.join(", ")}`,
  }),
});
