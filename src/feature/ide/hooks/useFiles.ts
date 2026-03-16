import { useEditorStore } from "@/feature/ide/state/ide.store";
import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { getFileInfo, getMimeType } from "@/feature/ide/utils/fileUtils";
import { EditorFile } from "@/feature/ide/state/ide.types";
import { config } from "@/config";

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
  function createFromProps(props: Omit<EditorFile, "id">) {
    // Sets props as file content if debugFileCreation is enabled.
    if (config.debugFileCreation) {
      props.content = JSON.stringify(props, null, 2);
    }

    const fileProps: EditorFile = {
      id: crypto.randomUUID(),
      ...props,
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
    createFromFile,
    saveFileAs,
  };
};

export default useFiles;
