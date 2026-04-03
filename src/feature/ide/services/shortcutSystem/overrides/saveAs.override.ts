import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import formattingService from "@/feature/ide/services/codeFormatting/FormattingService";

export const useSaveAsOverride = () => {
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const files = useEditorStore((state) => state.files);
  const updateFile = useEditorStore((state) => state.updateFile);

  useShortcut(["ctrl", "s"], async () => {
    if (!activeTabId || !files[activeTabId]) return;
    if (!files[activeTabId].hasUnformattedChanges) return;

    try {
      const file = files[activeTabId];
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
