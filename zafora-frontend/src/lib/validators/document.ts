import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  documentType: z.string().min(1, "Document type is required"),
  visibility: z.string().default("public"),
  fileUrl: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
