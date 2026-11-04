import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFiles } from "./useFiles";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { EditorFile } from "@/feature/ide/state/ide.types";

const makeFile = (id: string, name: string): EditorFile => ({
  id,
  name,
  path: `file://${name}`,
  type: "json",
  language: "json",
  lastModified: 1,
  cursor: { lineNumber: 1, column: 1 },
  cursorOffset: 0,
  viewState: { sentinel: "preserved" } as unknown as EditorFile["viewState"],
  content: '{"pending":true}',
  isClosed: false,
  hasUnsavedChanges: true,
});

describe("useFiles renameFile", () => {
  beforeEach(() => {
    const flushPendingChanges = vi.fn((id: string) => {
      useEditorStore.getState().updateFile(id, {
        content: "latest editor content",
        cursor: { lineNumber: 4, column: 2 },
      });
    });
    useEditorStore.setState({
      files: { inactive: makeFile("inactive", "old.json") },
      activeTabId: "active",
      activeFileIds: ["inactive", "active"],
      latestClosedFileIds: [],
      flushPendingChanges,
    });
    useModalStore.setState({ activeModal: null, modalData: null });
  });

  it("renames an explicit inactive file and preserves its identity and editor state", () => {
    const { result } = renderHook(() => useFiles());

    act(() => result.current.renameFile("inactive"));

    const modalData = useModalStore.getState().modalData;
    expect(modalData).toMatchObject({
      initialName: "old.json",
      title: "Rename File",
      excludedFileId: "inactive",
    });
    expect(useEditorStore.getState().flushPendingChanges).toHaveBeenCalledWith(
      "inactive",
    );

    act(() => modalData?.onSubmit?.("  renamed.ts  "));

    const state = useEditorStore.getState();
    expect(state.files.inactive).toMatchObject({
      id: "inactive",
      name: "renamed.ts",
      path: "file://renamed.ts",
      type: "ts",
      language: "typescript",
      content: "latest editor content",
      hasUnsavedChanges: true,
      cursor: { lineNumber: 4, column: 2 },
      viewState: { sentinel: "preserved" },
    });
    expect(state.activeTabId).toBe("active");
    expect(state.activeFileIds).toEqual(["inactive", "active"]);
    const persistedState = JSON.parse(
      localStorage.getItem("editor-store") ?? "{}",
    );
    expect(persistedState.state.files.inactive.name).toBe("renamed.ts");
  });

  it("preserves the current extension when rename input omits one", () => {
    const { result } = renderHook(() => useFiles());
    act(() => result.current.renameFile("inactive"));

    const modalData = useModalStore.getState().modalData;
    act(() => modalData?.onSubmit?.("renamed"));

    expect(useEditorStore.getState().files.inactive).toMatchObject({
      name: "renamed.json",
      path: "file://renamed.json",
      type: "json",
      language: "json",
    });
  });

  it("does nothing when the requested file is missing", () => {
    const { result } = renderHook(() => useFiles());

    act(() => result.current.renameFile("missing"));

    expect(useModalStore.getState().activeModal).toBeNull();
    expect(
      useEditorStore.getState().flushPendingChanges,
    ).not.toHaveBeenCalled();
  });

  it("ignores a malformed target without changing other workspace files", () => {
    useEditorStore.setState((state) => ({
      ...state,
      files: {
        ...state.files,
        malformed: null as unknown as EditorFile,
        unrelated: makeFile("unrelated", "untouched.json"),
      },
    }));
    const { result } = renderHook(() => useFiles());

    act(() => result.current.renameFile("malformed"));

    expect(useModalStore.getState().activeModal).toBeNull();
    expect(useEditorStore.getState().files.unrelated.name).toBe(
      "untouched.json",
    );
  });
});

describe("useFiles duplicateFile", () => {
  beforeEach(() => {
    const flushPendingChanges = vi.fn((id: string) => {
      useEditorStore.getState().updateFile(id, {
        content: '{"latest":true}',
        cursor: { lineNumber: 4, column: 2 },
      });
    });
    useEditorStore.setState({
      files: {
        source: makeFile("source", "data.json"),
        copy: makeFile("copy", "data-copy.json"),
      },
      activeTabId: "other",
      activeFileIds: ["source", "other"],
      latestClosedFileIds: [],
      flushPendingChanges,
    });
    useModalStore.setState({ activeModal: null, modalData: null });
  });

  it("copies the latest content to a new active file with an independent identity", () => {
    const { result } = renderHook(() => useFiles());

    act(() => result.current.duplicateFile("source"));

    const modalData = useModalStore.getState().modalData;
    expect(modalData).toMatchObject({
      initialName: "data-copy-2.json",
      title: "Duplicate File",
    });
    act(() => modalData?.onSubmit?.("  copied.ts  "));

    expect(useEditorStore.getState().flushPendingChanges).toHaveBeenCalledWith(
      "source",
    );

    const state = useEditorStore.getState();
    const duplicate = Object.values(state.files).find(
      (file) => file.name === "copied.ts",
    );
    expect(duplicate).toMatchObject({
      name: "copied.ts",
      path: "file://copied.ts",
      type: "ts",
      language: "typescript",
      content: '{"latest":true}',
      cursor: null,
      cursorOffset: 0,
      isClosed: false,
      hasUnsavedChanges: false,
    });
    expect(duplicate?.id).not.toBe("source");
    expect(state.activeTabId).toBe(duplicate?.id);
    expect(state.activeFileIds).toEqual(["source", "other", duplicate?.id]);
    expect(state.files.source).toMatchObject({
      id: "source",
      name: "data.json",
      content: '{"latest":true}',
    });
    expect(duplicate?.id && state.files[duplicate.id]).not.toBe(
      state.files.source,
    );
    const persistedState = JSON.parse(
      localStorage.getItem("editor-store") ?? "{}",
    );
    expect(persistedState.state.files[duplicate?.id].content).toBe(
      '{"latest":true}',
    );
  });

  it("rechecks names before creating if a collision appears while the dialog is open", () => {
    const { result } = renderHook(() => useFiles());

    act(() => result.current.duplicateFile("source"));
    const modalData = useModalStore.getState().modalData;

    act(() => {
      useEditorStore
        .getState()
        .createFile(makeFile("late", "data-copy-2.json"));
      modalData?.onSubmit?.("data-copy-2.json");
    });

    expect(useEditorStore.getState().files.late.name).toBe("data-copy-2.json");
    expect(Object.values(useEditorStore.getState().files)).toHaveLength(3);
  });

  it("does not open a dialog or create a file for an invalid source", () => {
    const { result } = renderHook(() => useFiles());

    act(() => result.current.duplicateFile("missing"));

    expect(useModalStore.getState().activeModal).toBeNull();
    expect(Object.keys(useEditorStore.getState().files)).toEqual([
      "source",
      "copy",
    ]);
  });
});
