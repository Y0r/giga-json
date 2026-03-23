import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";

export const useSearchOverride = () => {
  useShortcut(
    ["shift"],
    () => {
      // @todo implement search modal trigger.
      console.log("Double Shift pressed: Open Search Modal");
    },
    { isDoublePress: true },
  );
};
