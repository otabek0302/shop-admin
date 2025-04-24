import { create } from "zustand";

interface ConfirmStore {
    isOpen: boolean;
    openConfirm: () => void;
    closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
    isOpen: false,
    openConfirm: () => set({ isOpen: true }),
    closeConfirm: () => set({ isOpen: false }),
}));
