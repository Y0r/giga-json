import { useEditorStore } from "@/feature/ide/state/ide.store";
import { EditorFile } from "@/feature/ide/state/ide.types";

export const useTabs = (focusedTabId?: EditorFile["id"]) => {
  // Data retrieval.
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const activeFileIds = useEditorStore((state) => state.activeFileIds);
  const latestClosedFileIds = useEditorStore(
    (state) => state.latestClosedFileIds,
  );

  const targetTabId = focusedTabId ?? activeTabId;
  const targetTabPosition = targetTabId
    ? activeFileIds.indexOf(targetTabId)
    : -1;

  // Hooks for data manipulation.
  const closeTab = useEditorStore((state) => state.closeTab);
  const reopenTab = useEditorStore((state) => state.reopenTab);

  /**
   * Closes the currently active or focused tab.
   */
  function closeCurrentTab() {
    if (targetTabId) closeTab(targetTabId);
  }

  /**
   * Closes all tabs except the active or focused one.
   */
  function closeOtherTabs() {
    if (!targetTabId) return;
    activeFileIds.forEach((id) => {
      if (id !== targetTabId) {
        closeTab(id);
      }
    });
  }

  /**
   * Closes all tabs.
   */
  function closeAllTabs() {
    activeFileIds.forEach(closeTab);
  }

  /**
   * Closes all tabs to the left of the active or focused tab.
   */
  function closeTabsToTheLeft() {
    if (targetTabPosition <= 0) return;
    activeFileIds.slice(0, targetTabPosition).forEach(closeTab);
  }

  /**
   * Closes all tabs to the right of the active or focused tab.
   */
  function closeTabsToTheRight() {
    if (
      targetTabPosition === -1 ||
      targetTabPosition === activeFileIds.length - 1
    ) {
      return;
    }
    activeFileIds.slice(targetTabPosition + 1).forEach(closeTab);
  }

  /**
   * Reopens the last closed tab.
   *
   * The last closed tab is determined by the `latestClosedFileIds` store state.
   */
  function reopenClosedTab() {
    const lastClosedFileId = latestClosedFileIds.at(-1);
    if (lastClosedFileId) reopenTab(lastClosedFileId);
  }

  return {
    closeCurrentTab,
    closeOtherTabs,
    closeAllTabs,
    closeTabsToTheLeft,
    closeTabsToTheRight,
    reopenClosedTab,
  };
};
