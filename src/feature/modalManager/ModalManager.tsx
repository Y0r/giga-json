import React from "react";

import { useModalStore } from "@/feature/modalManager/state/modal.store";

import {
  NameInputModal,
  ReloadConfirmationModal,
} from "@/feature/modalManager/components";

/**
 * Manager component to render the active modal from the global state.
 */
export const ModalManager = () => {
  const { activeModal, modalData, closeModal } = useModalStore();

  if (!activeModal) return null;

  switch (activeModal) {
    case "RELOAD_CONFIRMATION":
      return (
        <ReloadConfirmationModal
          isOpen={true}
          onClose={closeModal}
          {...modalData}
        />
      );

    case "NAME_INPUT":
      return (
        <NameInputModal
          isOpen={true}
          onClose={closeModal}
          onSubmit={modalData?.onSubmit || (() => {})}
          {...modalData}
        />
      );

    default:
      return null;
  }
};
