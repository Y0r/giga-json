import { useEditorStore } from "@/feature/ide/state/ide.store";

export const useTabs = () => {
  // Data retrieval.
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const activeFileIds = useEditorStore((state) => state.activeFileIds);
  const latestClosedFileIds = useEditorStore(
    (state) => state.latestClosedFileIds,
  );

  // Hooks for data manipulation.
  const closeTab = useEditorStore((state) => state.closeTab);
  const reopenTab = useEditorStore((state) => state.reopenTab);

  /**
   * Closes the currently active tab.
   */
  function closeCurrentTab() {
    if (!activeTabId) return;
    closeTab(activeTabId);
  }

  /**
   * Closes all tabs except the active one.
   */
  function closeOtherTabs() {
    activeFileIds.map((id) => {
      if (id !== activeTabId) {
        closeTab(id);
      }
    });
  }

  /**
   * Closes all tabs.
   */
  function closeAllTabs() {
    activeFileIds.map(closeTab);
  }

  /**
   * Closes all tabs to the left of the active tab.
   */
  function closeTabsToTheLeft() {
    if (!activeTabId || activeFileIds.length <= 1) return;
    const position = activeFileIds.indexOf(activeTabId);
    const tabsToClose = activeFileIds.slice(0, position);
    tabsToClose.map(closeTab);
  }

  /**
   * Closes all tabs to the right of the active tab.
   */
  function closeTabsToTheRight() {
    if (!activeTabId || activeFileIds.length <= 1) return;
    const position = activeFileIds.indexOf(activeTabId);
    const tabsToClose = activeFileIds.slice(position + 1);
    tabsToClose.map(closeTab);
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
