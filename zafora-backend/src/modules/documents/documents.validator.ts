import { z } from "zod/v4";

export const CreateDocumentBody = z.object({
  title: z.string().min(1),
  documentType: z.string().min(1),
  visibility: z.string().default("public"),
  fileUrl: z.string().url().nullish(),
  description: z.string().nullish(),
});

export const UpdateDocumentBody = CreateDocumentBody.partial();

export const ListDocumentsQuery = z.object({
  visibility: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateDocumentBodyType = z.infer<typeof CreateDocumentBody>;
export type UpdateDocumentBodyType = z.infer<typeof UpdateDocumentBody>;
export type ListDocumentsQueryType = z.infer<typeof ListDocumentsQuery>;
