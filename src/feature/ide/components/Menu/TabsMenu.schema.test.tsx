import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useMenuSchema } from "./TabsMenu.schema";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { EditorFile } from "@/feature/ide/state/ide.types";
import { MenuItem } from "@/shared/Menu/state/menu.types";

const makeFile = (id: string, name: string): EditorFile => ({
  id,
  name,
  path: `file://${name}`,
  type: "json",
  language: "json",
  lastModified: 0,
  cursor: null,
  cursorOffset: 0,
  content: "{}",
  isClosed: false,
});

const invokeRenameAction = (items: MenuItem[]) => {
  const item =
    items.find((entry) => entry.label === "Rename file...") ??
    items
      .flatMap((entry) => entry.items ?? [])
      .find((entry) => entry.label === "Rename file...");
  if (item?.action?.type !== "callback") {
    throw new Error("Rename action is missing");
  }
  item.action.onClick();
};

describe("Tabs menu rename action", () => {
  beforeEach(() => {
    useEditorStore.setState({
      files: {
        active: makeFile("active", "active.json"),
        focused: makeFile("focused", "focused.json"),
      },
      activeTabId: "active",
      activeFileIds: ["active", "focused"],
      latestClosedFileIds: [],
    });
    useModalStore.setState({ activeModal: null, modalData: null });
  });

  it("renames the explicitly focused tab even when it is inactive", () => {
    const { result } = renderHook(() => useMenuSchema("focused"));

    act(() => invokeRenameAction(result.current.items));

    expect(useModalStore.getState().modalData).toMatchObject({
      initialName: "focused.json",
      excludedFileId: "focused",
    });
  });

  it("renames the active tab when invoked from Window → Editor Tabs", () => {
    const { result } = renderHook(() => useMenuSchema());

    act(() => invokeRenameAction(result.current.items));

    expect(useModalStore.getState().modalData).toMatchObject({
      initialName: "active.json",
      excludedFileId: "active",
    });
  });
});
