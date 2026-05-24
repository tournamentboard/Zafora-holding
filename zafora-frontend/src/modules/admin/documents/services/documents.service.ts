import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import type { Document } from "@/src/lib/types";
import type { CreateDocumentInput, UpdateDocumentInput } from "@/src/lib/validators";

type ListDocumentsParams = { visibility?: string; page?: number; limit?: number };
type ListDocumentsResponse = { documents: Document[]; total: number };

async function fetchDocuments(params?: ListDocumentsParams): Promise<ListDocumentsResponse> {
  const res = await apiAxios.get<ListDocumentsResponse>(API.DOCUMENTS.LIST, { params });
  return res.data;
}

async function createDocument(data: CreateDocumentInput): Promise<Document> {
  const res = await apiAxios.post<Document>(API.DOCUMENTS.LIST, data);
  return res.data;
}

async function updateDocument(id: number, data: UpdateDocumentInput): Promise<Document> {
  const res = await apiAxios.patch<Document>(API.DOCUMENTS.BY_ID(id), data);
  return res.data;
}

async function deleteDocument(id: number): Promise<void> {
  await apiAxios.delete(API.DOCUMENTS.BY_ID(id));
}

export const documentKeys = {
  all: ["admin", "documents"] as const,
  list: (params?: ListDocumentsParams) =>
    [...documentKeys.all, "list", params] as const,
};

export function useDocuments(params?: ListDocumentsParams) {
  return useQuery({
    queryKey: documentKeys.list(params),
    queryFn: () => fetchDocuments(params),
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDocumentInput }) =>
      updateDocument(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => qc.invalidateQueries({ queryKey: documentKeys.all }),
  });
}
