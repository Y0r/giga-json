import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEditorStore } from "@/feature/ide/state/ide.store";
import formattingService from "@/feature/ide/services/codeFormatting/FormattingService";

export const useSaveAsOverride = () => {
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const files = useEditorStore((state) => state.files);
  const updateFile = useEditorStore((state) => state.updateFile);

  useShortcut(["ctrl", "s"], async () => {
    console.log("Ctrl+S pressed: Save file");
    if (!activeTabId || !files[activeTabId]) return;

    const file = files[activeTabId];
    const formattedContent = await formattingService.format(
      file.content,
      file.language,
    );

    if (formattedContent !== file.content) {
      updateFile(activeTabId, { content: formattedContent });
    }
  });
};
