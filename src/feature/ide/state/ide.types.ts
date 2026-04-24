import * as monaco from "monaco-editor";
import { IPosition } from "monaco-editor";

// Base interface for a file.
// Defines the structure of a file object used in the IDE.
export interface EditorFile {
  // File metadata.
  id: string;
  name: string;
  type: string;
  lastModified: number;

  // Monaco state.
  path: string;
  language: string;
  content: string;
  cursor: IPosition | null;
  cursorOffset: number;
  viewState?: monaco.editor.ICodeEditorViewState;

  // File state.
  isClosed: boolean;
  hasBeenUpdated?: boolean;
  hasUnsavedChanges?: boolean;
  hasUnformattedChanges?: boolean;
}

// Interface for the editor state.
// Keeps track of all the files and their active states.
export interface EditorState {
  files: Record<string, EditorFile>;
  activeTabId: string | null;
  activeFileIds: string[];
  latestClosedFileIds: string[];

  // File-related actions.
  createFile: (file: EditorFile) => void;
  updateFile: (id: string, file: Partial<EditorFile>) => void;
  deleteFile: (id: string) => void;
  // Tabs-related actions.
  openTab: (id: string) => void;
  reopenTab: (id: string) => void;
  closeTab: (id: string) => void;
  updateTabs: (updatedActiveFileIds: string[]) => void;

  /**
   * Sync-related actions.
   *
   * `flushPendingChanges` provides a way for external components to ensure
   * the local editor state is committed to the global store immediately.
   */
  flushPendingChanges: (id: string) => void;
  setFlushPendingChanges: (flush: (id: string) => void) => void;
}
