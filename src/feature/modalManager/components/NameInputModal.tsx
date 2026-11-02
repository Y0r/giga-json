import React, { useEffect, useRef, useState } from "react";

import { normalizeFileName } from "@/feature/ide/services/fileNaming/FileNamingService";
import { findFileNameCollision } from "@/feature/ide/services/fileManagement/FileManagementService";
import { useEditorStore } from "@/feature/ide/state/ide.store";

import { Input, Field, Portal, Dialog, CloseButton } from "@chakra-ui/react";

interface FileNameInputModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
  initialName?: string;
  title?: string;
  excludedFileId?: string;
}

/**
 * Modal to prompt the user for a new file name.
 */
export const NameInputModal = ({
  isOpen,
  onSubmit,
  onClose,
  initialName = "",
  title = "New File Name",
  excludedFileId,
}: FileNameInputModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Hook to access file operations and lookup
  const files = useEditorFiles();

  // Reset state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialName);
      setError(null);
      // Use requestAnimationFrame or setTimeout to ensure focus happens after render
      const timeout = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(timeout);
    }
  }, [initialName, isOpen]);

  const handleSubmit = () => {
    const normalized = normalizeFileName(value);
    if (!normalized) {
      setError("Name cannot be empty");
      return;
    }

    if (
      normalized.name !== initialName &&
      findFileNameCollision(files, normalized.name, excludedFileId)
    ) {
      setError(`A file with the name "${normalized.name}" already exists`);
      return;
    }

    onSubmit(normalized.name);
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
          <Dialog.Content
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
              }
            }}
          >
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
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

const useEditorFiles = () => {
  return useEditorStore((state) => state.files);
};
