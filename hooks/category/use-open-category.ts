import { create } from "zustand";

type OpenCategory = {
  id?: string;
  name?: string;
  isOpen: boolean;
  onOpen: (id: string, name?: string) => void;
  onClose: () => void;
};

export const useOpenCategory = create<OpenCategory>((set) => ({
  id: undefined,
  name: undefined,
  isOpen: false,
  onOpen: (id: string, name?: string) => set({ isOpen: true, id, name }),
  onClose: () => set({ isOpen: false, id: undefined, name: undefined }),
}));
