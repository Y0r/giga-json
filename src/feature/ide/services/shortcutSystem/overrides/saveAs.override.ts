import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import formattingService from "@/feature/ide/services/codeFormatting/FormattingService";

import { config } from "@/config";

export const useSaveAsOverride = () => {
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const files = useEditorStore((state) => state.files);
  const updateFile = useEditorStore((state) => state.updateFile);
  const flushPendingChanges = useEditorStore(
    (state) => state.flushPendingChanges,
  );

  useShortcut(["ctrl", "s"], async () => {
    if (!config.onShortcutPreventBrowserSaveAs) {
      return;
    }

    if (!activeTabId || !files[activeTabId]) return;

    // Ensure all pending changes in the editor are flushed to the store before formatting.
    flushPendingChanges(activeTabId);

    // Re-fetch the file from the store to get the latest content after flushing.
    const file = useEditorStore.getState().files[activeTabId];

    // Skip formatting if the file has no unformatted changes.
    if (!file || !file.hasUnformattedChanges) return;

    try {
      const { code, cursorOffset } = await formattingService.formatWithCursor(
        file.content,
        file.language,
        file.cursorOffset,
      );

      updateFile(activeTabId, {
        content: code,
        cursorOffset: cursorOffset,
        cursor: null,
        hasBeenUpdated: true,
        hasUnformattedChanges: false,
      });

      return;
    } catch (error) {
      // @todo register an error with notification?
      // @todo should we skip this error?
      console.error("Failed to format file content", error);
    }
  });
};
