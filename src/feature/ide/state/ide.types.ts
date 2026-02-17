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
  isDeleted: boolean;
  hasUnsavedChanges: boolean;
}

// Interface for the editor state.
// Keeps track of all the files and their active states.
export interface EditorState {
  files: Record<string, EditorFile>;
  activeFileIds: string[];
  activeTabId: string | null;
}
