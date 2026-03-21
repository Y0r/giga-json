import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EditorFile, EditorState } from "./ide.types";

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      files: {},
      activeTabId: null,
      activeFileIds: [],
      latestClosedFileIds: [],

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

      // Update an existing file in the editor state.
      updateFile: (id: string, file: Partial<EditorFile>) => {
        set((state) => ({
          files: {
            ...state.files,
            [id]: {
              ...state.files[id],
              ...file,
              // Modify the last modified time of the file.
              lastModified: Number(new Date()),
            },
          },
        }));
      },

      // Completely remove a file from the editor state.
      deleteFile: (id: string) =>
        set((state) => {
          // Remove the file from the editor state.
          const newActiveTabId = state.activeFileIds[0];
          const { [id]: _, ...remainingFiles } = state.files;

          return {
            files: remainingFiles,
            activeTabId: newActiveTabId,
            activeFileIds: state.activeFileIds.filter(
              (fileId) => fileId !== id,
            ),
            latestClosedFileIds: state.latestClosedFileIds.filter(
              (fileId) => fileId !== id,
            ),
          };
        }),

      // Open a file in the editor state.
      openTab: (id: string) =>
        set((state) => ({
          activeTabId: id,
        })),

      // Reopen a recently closed file.
      reopenTab: (id: string) =>
        set((state) => ({
          files: {
            ...state.files,
            [id]: { ...state.files[id], isClosed: false },
          },
          activeTabId: id,
          activeFileIds: [...state.activeFileIds, id],
          latestClosedFileIds: state.latestClosedFileIds.filter(
            (fileId) => fileId !== id,
          ),
        })),

      // Close a file in the editor state.
      closeTab: (id: string) =>
        set((state) => ({
          files: {
            ...state.files,
            [id]: { ...state.files[id], isClosed: true },
          },
          // @todo open previous tab in the list, not first in the list.
          activeTabId: state.activeFileIds[0],
          activeFileIds: state.activeFileIds.filter((fileId) => fileId !== id),
          latestClosedFileIds: [...state.latestClosedFileIds, id],
        })),

      // Update all active file ids in the editor state.
      // Note: to not use this method to add or remove items.
      updateTabs: (updatedActiveFileIds: string[]) =>
        set((state) => ({
          // Destruct and create a new array to avoid mutating the original array.
          // Otherwise, change will not propagate to other components.
          activeFileIds: [...updatedActiveFileIds],
        })),
    }),
    { name: "editor-store" },
  ),
);
