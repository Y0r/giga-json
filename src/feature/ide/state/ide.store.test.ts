import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./ide.store";

describe("Editor File Store", () => {
  it("should create a new file and set it as active", () => {
    const { createFile } = useEditorStore.getState();
    const numberOfInitialFiles = 5;

    for (let index = 0; index < numberOfInitialFiles; index++) {
      const randomId = crypto.randomUUID();
      const id = `fid-${index}`;
      const name = `file-${randomId}.json`;

      let file = {
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

  // @todo test updating file
  // @todo test updating active file
  // @todo test lastUpdated prop.

  it("should correctly remove active file when deleted", () => {
    const { activeTabId, deleteFile } = useEditorStore.getState();
    const fileId = activeTabId;

    if (!fileId) return;
    deleteFile(fileId);

    const state = useEditorStore.getState();
    expect(state.files[fileId]).toBeUndefined();
    expect(state.activeTabId).not.toEqual(fileId);
    expect(state.activeFileIds).not.toContain(fileId);
  });
});
