import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EditorFile, EditorState } from "./ide.types";

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      files: {},
      activeFileIds: [],
      activeTabId: null,

      // Create a new file in the editor state.
      createFile: (file: EditorFile) =>
        set((state) => ({
          // Add or replaces an existing file in the editor state.
          files: { ...state.files, [file.id]: file },
          // Add id to active file ids to render tab.
          activeFileIds: [...state.activeFileIds, file.id],
          // Change the active tab id to a newly created file.
          activeTabId: file.id,
        })),

      // Open a file in the editor state.
      openFile: (id: string) =>
        set((state) => ({
          activeTabId: id,
        })),
    }),
    { name: "editor-store" },
  ),
);
