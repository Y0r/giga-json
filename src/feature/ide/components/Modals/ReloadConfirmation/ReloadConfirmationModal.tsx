import React from "react";
import { Text, Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

interface ReloadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal to display when the user tries to reload the page.
 *
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {() => void} onClose - Callback to be called when the modal is closed.
 */
export const ReloadConfirmationModal = ({
  isOpen,
  onClose,
}: ReloadConfirmationModalProps) => {
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onClose}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                Hold on! Are you sure you want to reload?
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize={"md"} fontWeight={"regular"} pb={3}>
                Reloading the page will cause you to lose any unsaved changes
                and history of changes in the file(s).
              </Text>

              <Text fontSize={"sm"} fontWeight={"bold"}>
                Note: the file(s) changes itself will be preserved.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>

              <Dialog.ActionTrigger asChild>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              <Button
                colorPalette="red"
                onClick={() => {
                  window.onbeforeunload = null;
                  window.location.reload();
                }}
              >
                Reload
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ReloadConfirmationModal;
