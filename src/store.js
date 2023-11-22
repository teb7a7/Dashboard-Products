import { create } from "zustand";

export const useAppStore = create((set) => ({
  open: false,
  title: "",
  price: 0,
  id: null,
  setID: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  setPrice: (price) => set({ price }),
  setOpen: (open) => set({ open }),
}));
