import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";

export type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string;
  page: string;
  displayOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

const faqsKeys = {
  all: ["admin", "faqs"] as const,
};

export function useFaqs() {
  return useQuery({
    queryKey: faqsKeys.all,
    queryFn: async () => {
      const res = await apiAxios.get<{ faqs: Faq[] }>(API.CONTENT.FAQS);
      return res.data.faqs;
    },
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Faq, "id" | "createdAt" | "updatedAt">) =>
      apiAxios.post<Faq>(API.CONTENT.FAQS, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqsKeys.all }),
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Faq, "id" | "createdAt" | "updatedAt">> }) =>
      apiAxios.patch<Faq>(API.CONTENT.FAQS_BY_ID(id), data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqsKeys.all }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiAxios.delete(API.CONTENT.FAQS_BY_ID(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqsKeys.all }),
  });
}
