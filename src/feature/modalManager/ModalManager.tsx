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

  return (
    <>
      <ReloadConfirmationModal
        isOpen={activeModal === "RELOAD_CONFIRMATION"}
        onClose={closeModal}
      />
      <NameInputModal
        isOpen={activeModal === "NAME_INPUT"}
        onClose={closeModal}
        onSubmit={modalData?.onSubmit || (() => {})}
        {...modalData}
      />
    </>
  );
};
