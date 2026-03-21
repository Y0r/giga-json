import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./ide.store";
import { EditorFile } from "./ide.types";

describe("Editor Store", () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test.
    useEditorStore.setState({
      files: {},
      activeTabId: null,
      activeFileIds: [],
      latestClosedFileIds: [],
    });
  });

  describe("Editor File Store", () => {
    it("should create a new file and set it as active", () => {
      const { createFile } = useEditorStore.getState();
      const numberOfInitialFiles = 5;

      for (let index = 0; index < numberOfInitialFiles; index++) {
        const randomId = crypto.randomUUID();
        const id = `fid-${index}`;
        const name = `file-${randomId}.json`;

        const file: EditorFile = {
          id: id,
          name: name,
          path: `file://${name}`,
          type: "json",
          language: "json",
          lastModified: Date.now(),
          cursor: 0,
          content: "{}",
          isClosed: false,
          hasUnsavedChanges: false,
        };

        createFile(file);

        const state = useEditorStore.getState();
        expect(state.files[id]).toEqual(file);
        expect(state.activeTabId).toBe(id);
        expect(state.activeFileIds).toContain(id);
      }
    });

    it("should update an existing file", () => {
      const { createFile, updateFile } = useEditorStore.getState();
      const id = "test-file";
      const file: EditorFile = {
        id,
        name: "test.json",
        path: "file://test.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file);
      updateFile(id, { content: '{"updated": true}' });

      const state = useEditorStore.getState();
      expect(state.files[id].content).toBe('{"updated": true}');
    });

    it("should update lastModified property when file is updated", () => {
      const { createFile, updateFile } = useEditorStore.getState();
      const id = "test-file";
      const initialLastModified = 1000;
      const file: EditorFile = {
        id,
        name: "test.json",
        path: "file://test.json",
        type: "json",
        language: "json",
        lastModified: initialLastModified,
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file);

      const beforeUpdate = Date.now();
      updateFile(id, { content: '{"updated": true}' });
      const afterUpdate = Date.now();

      const state = useEditorStore.getState();
      const updatedLastModified = state.files[id].lastModified;

      expect(updatedLastModified).toBeGreaterThanOrEqual(beforeUpdate);
      expect(updatedLastModified).toBeLessThanOrEqual(afterUpdate);
      expect(updatedLastModified).not.toBe(initialLastModified);
    });

    it("should correctly remove active file when deleted", () => {
      const { createFile, deleteFile } = useEditorStore.getState();

      // Create the first file.
      const file1: EditorFile = {
        id: "f1",
        name: "f1.json",
        path: "file://f1.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };
      createFile(file1);

      // Create a second file.
      const file2: EditorFile = {
        id: "f2",
        name: "f2.json",
        path: "file://f2.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };
      createFile(file2);

      const fileId = file2.id;
      deleteFile(fileId);

      const state = useEditorStore.getState();

      // File is removed from the store.
      expect(state.files[fileId]).toBeUndefined();
      // Tab changes to the first available file.
      expect(state.activeTabId).toBe("f1");
      // The file is removed from the active file list.
      expect(state.activeFileIds).not.toContain(fileId);
    });
  });

  describe("Editor Tab Store", () => {
    it("should switch active tab", () => {
      const { createFile, openTab } = useEditorStore.getState();

      const file1: EditorFile = {
        id: "f1",
        name: "f1.json",
        path: "file://f1.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };
      const file2: EditorFile = {
        id: "f2",
        name: "f2.json",
        path: "file://f2.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file1);
      createFile(file2);

      // The last created file should be active.
      expect(useEditorStore.getState().activeTabId).toBe("f2");

      // Change the active tab.
      openTab("f1");
      expect(useEditorStore.getState().activeTabId).toBe("f1");
    });

    it("should reorder tabs", () => {
      const { createFile, updateTabs } = useEditorStore.getState();

      const file1: EditorFile = {
        id: "f1",
        name: "f1.json",
        path: "file://f1.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };
      const file2: EditorFile = {
        id: "f2",
        name: "f2.json",
        path: "file://f2.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file1);
      createFile(file2);

      expect(useEditorStore.getState().activeFileIds).toEqual(["f1", "f2"]);

      updateTabs(["f2", "f1"]);
      expect(useEditorStore.getState().activeFileIds).toEqual(["f2", "f1"]);
    });

    it("should close a tab", () => {
      const { createFile, closeTab } = useEditorStore.getState();

      const file1: EditorFile = {
        id: "f1",
        name: "f1.json",
        path: "file://f1.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };
      const file2: EditorFile = {
        id: "f2",
        name: "f2.json",
        path: "file://f2.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file1);
      createFile(file2);

      closeTab("f2");

      const state = useEditorStore.getState();
      expect(state.activeFileIds).not.toContain("f2");
      expect(state.latestClosedFileIds).toContain("f2");
      expect(state.files["f2"].isClosed).toBe(true);
      // Check if activeTabId changed (should be "f1" as it's the first in activeFileIds)
      expect(state.activeTabId).toBe("f1");
    });

    it("should reopen a closed tab", () => {
      const { createFile, closeTab, reopenTab } = useEditorStore.getState();

      const file1: EditorFile = {
        id: "f1",
        name: "f1.json",
        path: "file://f1.json",
        type: "json",
        language: "json",
        lastModified: Date.now(),
        cursor: 0,
        content: "{}",
        isClosed: false,
        hasUnsavedChanges: false,
      };

      createFile(file1);
      closeTab("f1");

      expect(useEditorStore.getState().activeFileIds).not.toContain("f1");
      expect(useEditorStore.getState().latestClosedFileIds).toContain("f1");

      reopenTab("f1");

      const state = useEditorStore.getState();
      expect(state.activeFileIds).toContain("f1");
      expect(state.latestClosedFileIds).not.toContain("f1");
      expect(state.files["f1"].isClosed).toBe(false);
      expect(state.activeTabId).toBe("f1");
    });
  });
});
