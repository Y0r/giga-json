import { useEditorStore } from "@/feature/ide/state/ide.store";
import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { getFileInfo, getMimeType } from "@/feature/ide/utils/fileUtils";
import { EditorFile } from "@/feature/ide/state/ide.types";
import { config } from "@/config";
import { normalizeFileName } from "@/feature/ide/services/fileNaming/FileNamingService";
import {
  findFileNameCollision,
  suggestUniqueCopyName,
} from "@/feature/ide/services/fileManagement/FileManagementService";

/**
 * Hook to manage file operations in the IDE.
 *
 * Provides methods for creating new empty files via user input and opening
 * existing files from the local file system.
 *
 * @returns An object containing the `createEmptyFile` and `createFromFile` functions.
 */
export const useFiles = () => {
  // Data retrieval.
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const files = useEditorStore((state) => state.files);

  // Hooks for data manipulation.
  const createFile = useEditorStore((state) => state.createFile);
  const openTab = useEditorStore((state) => state.openTab);
  const openModal = useModalStore((state) => state.openModal);
  const reopenTab = useEditorStore((state) => state.reopenTab);
  const updateFile = useEditorStore((state) => state.updateFile);
  const flushPendingChanges = useEditorStore(
    (state) => state.flushPendingChanges,
  );

  /**
   * Retrieves a file by a given key and value.
   */
  function getFileBy(
    key: keyof EditorFile,
    value: EditorFile[keyof EditorFile],
  ): EditorFile | null {
    return Object.values(files).find((file) => file[key] === value) ?? null;
  }

  /**
   * Opens a modal to prompt the user for a filename and creates a new empty file.
   *
   * Defaults to a `.txt` extension if none is provided. The file is automatically
   * added to the editor state and opened in a new tab.
   */
  function createEmptyFile() {
    openModal("NAME_INPUT", {
      onSubmit: (userInput: string) => {
        const { name, type, language } = getFileInfo(userInput);
        const path = `file://${name}`;

        const data = {
          name: name,
          path: path,
          type: type,
          lastModified: Date.now(),
          // Monaco required props.
          language: language,
          cursor: 0,
          content: "",
          // State props.
          isClosed: false,
          hasUnsavedChanges: false,
        };

        createFromProps(data);
      },
    });
  }

  /** Opens the shared filename dialog and renames the selected workspace file. */
  function renameFile(fileId: string) {
    const file = useEditorStore.getState().files[fileId];
    if (
      !file ||
      file.id !== fileId ||
      typeof file.name !== "string" ||
      !file.name.trim()
    ) {
      return;
    }

    flushPendingChanges(fileId);
    openModal("NAME_INPUT", {
      initialName: file.name,
      title: "Rename File",
      excludedFileId: fileId,
      onSubmit: (input: string) => {
        const current = useEditorStore.getState().files[fileId];
        const currentFiles = useEditorStore.getState().files;
        const normalized = normalizeFileName(input, current?.name);
        if (
          !normalized ||
          !current ||
          current.id !== fileId ||
          typeof current.name !== "string" ||
          findFileNameCollision(currentFiles, normalized.name, fileId)
        ) {
          return;
        }

        if (normalized.name === current.name) return;

        updateFile(fileId, {
          name: normalized.name,
          path: `file://${normalized.name}`,
          type: normalized.type,
          language: normalized.language,
        });
      },
    });
  }

  /** Opens the shared naming dialog and creates an independent workspace copy. */
  function duplicateFile(fileId: string) {
    const source = useEditorStore.getState().files[fileId];
    if (
      !source ||
      source.id !== fileId ||
      typeof source.name !== "string" ||
      !source.name.trim() ||
      typeof source.content !== "string"
    ) {
      return;
    }

    const initialName = suggestUniqueCopyName(
      useEditorStore.getState().files,
      source.name,
    );

    openModal("NAME_INPUT", {
      initialName,
      title: "Duplicate File",
      onSubmit: (input: string) => {
        // Flush again on submit so edits made while the dialog was open are copied.
        flushPendingChanges(fileId);
        const currentState = useEditorStore.getState();
        const current = currentState.files[fileId];
        const normalized = normalizeFileName(input, current?.name);
        if (
          !current ||
          current.id !== fileId ||
          typeof current.name !== "string" ||
          !current.name.trim() ||
          typeof current.content !== "string" ||
          !normalized ||
          findFileNameCollision(currentState.files, normalized.name)
        ) {
          return;
        }

        const { name, type, language } = normalized;
        createFromProps(
          {
            ...current,
            name,
            path: `file://${name}`,
            type,
            language,
            lastModified: Date.now(),
            content: current.content,
            cursor: null,
            cursorOffset: 0,
            viewState: undefined,
            isClosed: false,
            hasBeenUpdated: false,
            hasUnsavedChanges: false,
            hasUnformattedChanges: false,
          },
          true,
        );
      },
    });
  }

  /**
   * Opens a native file picker to select a file from the local file system.
   *
   * Reads the file content and its metadata (name, type, last modified date)
   * to create and open a corresponding file in the IDE.
   */
  async function createFromFile() {
    try {
      const [handle] = await window.showOpenFilePicker();
      const file = await handle.getFile();
      const content = await file.text();
      const { type, language } = getFileInfo(file.name);

      // Try to find a duplicate of the file by path.
      const duplicateOf = getFileBy("path", `file://${file.name}`);

      if (duplicateOf) {
        // If duplicate, bug origin is closed, then reopen it.
        if (!duplicateOf.isClosed) {
          reopenTab(duplicateOf.id);
          return;
        }

        const error = `Duplicate file detected: file://${file.name}. Opening existing file instead.`;
        console.log(error);
        openTab(duplicateOf.id);
        return;
      }

      const data = {
        name: file.name,
        path: `file://${file.name}`,
        type: type,
        lastModified: file.lastModified,
        // Monaco required props.
        language: language,
        cursor: 0,
        content: content,
        // State props.
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFromProps(data);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        // @todo register an error with notification.
        console.error("Failed to create file from local file system", error);
      }
    }
  }

  /**
   * Internal helper to finalize file creation by adding a unique identifier.
   *
   * @param props - The initial properties for the file.
   */
  function createFromProps(
    props: Omit<EditorFile, "id">,
    preserveContent = false,
  ) {
    // Sets props as file content if debugFileCreation is enabled.
    if (config.debugFileCreation && !preserveContent) {
      props.content = JSON.stringify(props, null, 2);
    }

    const fileProps: EditorFile = {
      ...props,
      id: crypto.randomUUID(),
    };

    // Add the file to the editor state and open its tab.
    createFile(fileProps);
  }

  /**
   * Prompts the user to save a file with a specified name and type in a location of their choice.
   *
   * This method retrieves the currently active file based on the active tab ID, determines its MIME type,
   * and opens a save file dialog for the user. If no active tab is found, the operation is canceled.
   *
   * @return {Promise<FileSystemFileHandle | undefined>} A promise that resolves to a `FileSystemFileHandle`
   * object representing the saved file, or `undefined` if no active tab is found or the operation is canceled.
   */
  async function saveFileAs() {
    if (!activeTabId) return;
    const file = files[activeTabId];
    const mimeType = getMimeType(file.name) ?? "text/plain";

    const options = {
      startIn: "downloads",
      suggestedName: file.name,
      types: [{ accept: { [mimeType]: [`.${file.type}`] } }],
    };

    return await window.showSaveFilePicker(options);
  }

  return {
    getFileBy,
    createEmptyFile,
    renameFile,
    duplicateFile,
    createFromFile,
    saveFileAs,
  };
};

export default useFiles;
