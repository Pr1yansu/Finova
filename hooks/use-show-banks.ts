import { create } from "zustand";

type ShowBanksState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useShowBanks = create<ShowBanksState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
