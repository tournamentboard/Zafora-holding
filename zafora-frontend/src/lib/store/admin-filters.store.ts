import { create } from "zustand";

interface LeadsFilterState {
  status: string;
  requestType: string;
  page: number;
  setStatus: (v: string) => void;
  setRequestType: (v: string) => void;
  setPage: (v: number) => void;
  reset: () => void;
}

export const useLeadsFilterStore = create<LeadsFilterState>((set) => ({
  status: "",
  requestType: "",
  page: 1,
  setStatus: (status) => set({ status, page: 1 }),
  setRequestType: (requestType) => set({ requestType, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ status: "", requestType: "", page: 1 }),
}));

interface ProjectsFilterState {
  sector: string;
  status: string;
  search: string;
  setSector: (v: string) => void;
  setStatus: (v: string) => void;
  setSearch: (v: string) => void;
  reset: () => void;
}

export const useProjectsFilterStore = create<ProjectsFilterState>((set) => ({
  sector: "",
  status: "",
  search: "",
  setSector: (sector) => set({ sector }),
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  reset: () => set({ sector: "", status: "", search: "" }),
}));
