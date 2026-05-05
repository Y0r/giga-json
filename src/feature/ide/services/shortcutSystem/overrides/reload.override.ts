import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEffect } from "react";

import { config } from "@/config";

export const useReloadOverride = () => {
  const isEnabled =
    config.onShortcutPreventAll && config.onShortcutPreventBrowserReload;
  const openModal = useModalStore((s) => s.openModal);

  // F5.
  useShortcut(["f5"], () => openModal("RELOAD_CONFIRMATION"), {
    enabled: isEnabled,
  });

  // Ctrl+R or Cmd+R.
  useShortcut(["ctrl", "r"], () => openModal("RELOAD_CONFIRMATION"), {
    enabled: isEnabled,
  });
  useShortcut(["meta", "r"], () => openModal("RELOAD_CONFIRMATION"), {
    enabled: isEnabled,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
      return true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEnabled]);
};
