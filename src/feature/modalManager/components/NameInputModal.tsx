import React, { useEffect, useRef, useState } from "react";

import { useFiles } from "@/feature/ide/hooks/useFiles";
import { getFileInfo } from "@/feature/ide/utils/fileUtils";

import { Input, Field, Portal, Dialog, CloseButton } from "@chakra-ui/react";

interface FileNameInputModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

/**
 * Modal to prompt the user for a new file name.
 */
export const NameInputModal = ({
  isOpen,
  onSubmit,
  onClose,
}: FileNameInputModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hook to access file operations and lookup
  const { getFileBy } = useFiles();

  // Reset state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setValue("");
      setError(null);
      // Use requestAnimationFrame or setTimeout to ensure focus happens after render
      const timeout = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const trimmedValue = value.trim();

    // Requirement: Name could not be empty
    if (!trimmedValue) {
      setError("Name cannot be empty");
      return;
    }

    // Resolve the final name (handles extensions like .txt)
    const { name } = getFileInfo(trimmedValue);

    // Requirement: Name should be unique (using getFileBy)
    if (getFileBy("name", name)) {
      setError(`A file with the name "${name}" already exists`);
      return;
    }

    // If valid, submit and close
    onSubmit(trimmedValue);
    onClose();
  };

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
              <Field.Root invalid={!!error} required>
                <Input
                  ref={inputRef}
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={"Enter file name..."}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                {error && <Field.ErrorText>{error}</Field.ErrorText>}
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
