import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";

export const useSaveAsOverride = () => {
  useShortcut(["ctrl", "s"], () => {
    // @todo implement reformat code trigger.
    console.log("Ctrl + S pressed: Reformat instead of Save As");
  });
};
