import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import formattingService from "@/feature/ide/services/codeFormatting/FormattingService";

export const useSaveAsOverride = () => {
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const files = useEditorStore((state) => state.files);
  const updateFile = useEditorStore((state) => state.updateFile);
  const flushPendingChanges = useEditorStore(
    (state) => state.flushPendingChanges,
  );

  useShortcut(["ctrl", "s"], async () => {
    if (!activeTabId || !files[activeTabId]) return;

    // Ensure all pending changes in the editor are flushed to the store before formatting.
    flushPendingChanges(activeTabId);

    // Re-fetch the file from the store to get the latest content after flushing.
    const file = useEditorStore.getState().files[activeTabId];

    // Skip formatting if the file has no unformatted changes.
    if (!file || !file.hasUnformattedChanges) return;

    try {
      console.log("Started code reformatting.");
      // @todo format code with calculation of the cursor position.
      const formattedContent = await formattingService.format(
        file.content,
        file.language,
      );

      updateFile(activeTabId, {
        content: formattedContent,
        hasBeenUpdated: true,
        hasUnformattedChanges: false,
      });
      return;
    } catch (error) {
      // @todo register an error with notification?
      console.error("Failed to format file content", error);
    }
  });
};
