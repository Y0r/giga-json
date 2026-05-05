import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";

import { config } from "@/config";

export const useSearchOverride = () => {
  const isEnabled =
    config.onShortcutPreventAll && config.onShortcutPreventEditorSearch;

  useShortcut(
    ["shift"],
    () => {
      // @todo implement search modal trigger.
      console.log("Double Shift pressed: Open Search Modal");
    },
    { isDoublePress: true, enabled: isEnabled },
  );
};
