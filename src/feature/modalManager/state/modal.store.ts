import { create } from "zustand";
import { ModalState, ModalType, ModalData } from "./modal.types";

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalData: null,
  openModal: (type: ModalType, data: ModalData | null = null) =>
    set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
