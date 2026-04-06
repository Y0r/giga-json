import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";

import { config } from "@/config";

export const useSearchOverride = () => {
  if (!config.onShortcutPreventEditorSearch) {
    return;
  }

  useShortcut(
    ["shift"],
    () => {
      // @todo implement search modal trigger.
      console.log("Double Shift pressed: Open Search Modal");
    },
    { isDoublePress: true },
  );
};
