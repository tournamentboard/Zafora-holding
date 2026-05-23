import { create } from "zustand";

type ModalId = "expressInterest" | "interests" | "preview" | "confirmDelete";

interface ModalState {
  activeModal: ModalId | null;
  modalPayload: Record<string, unknown>;
  openModal: (id: ModalId, payload?: Record<string, unknown>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalPayload: {},
  openModal: (id, payload = {}) =>
    set({ activeModal: id, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: {} }),
}));
