import React, { useEffect, useRef, useState } from "react";
import { Input, Field, Portal, Dialog, CloseButton } from "@chakra-ui/react";

interface FileNameInputModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

/**
 * Modal to prompt the user for a new file name.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onSubmit - Callback function to handle the submission of the file name.
 * @param {Function} props.onClose - Callback function to handle the closing of the modal.
 */
export const NameInputModal = ({
  isOpen,
  onSubmit,
  onClose,
}: FileNameInputModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
              <Dialog.Title>New File Name</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root required>
                <Input
                  ref={inputRef}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  placeholder={"Name"}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onSubmit(value);
                      onClose();
                    }
                  }}
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default NameInputModal;
