export type ModalType = "RELOAD_CONFIRMATION" | "NAME_INPUT" | null;

export interface ModalData {
  onSubmit?: (name: string) => void;
  [key: string]: unknown;
}

export interface ModalState {
  activeModal: ModalType;
  modalData: ModalData | null;
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
}
