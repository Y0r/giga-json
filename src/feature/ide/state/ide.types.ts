// Base interface for a file.
// Defines the structure of a file object used in the IDE.
export interface EditorFile {
  // File metadata.
  id: string;
  name: string;
  type: string;

  // Monaco state.
  path: string;
  language: string;
  content: string;
  // @todo use proper type.
  viewState?: unknown;

  // File state.
  isClosed: boolean;
  hasUnsavedChanges: boolean;
}

// Interface for the editor state.
// Keeps track of all the files and their active states.
export interface EditorState {
  files: Record<string, EditorFile>;
  activeTabId: string | null;
  activeFileIds: string[];
  latestClosedFileIds: string[];

  // Actions
  createFile: (file: EditorFile) => void;
  deleteFile: (id: string) => void;
  openTab: (id: string) => void;
  reopenTab: (id: string) => void;
  closeTab: (id: string) => void;
  updateTabs: (updatedActiveFileIds: string[]) => void;
}
