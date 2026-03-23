import { useModalStore } from "@/feature/modalManager/state/modal.store";
import { useShortcut } from "@/feature/ide/services/shortcutSystem/hooks/useShortcut";
import { useEffect } from "react";

export const useReloadOverride = () => {
  const openModal = useModalStore((s) => s.openModal);

  // F5.
  useShortcut(["f5"], () => openModal("RELOAD_CONFIRMATION"));

  // Ctrl+R or Cmd+R.
  useShortcut(["ctrl", "r"], () => openModal("RELOAD_CONFIRMATION"));
  useShortcut(["meta", "r"], () => openModal("RELOAD_CONFIRMATION"));

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
      return true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};
