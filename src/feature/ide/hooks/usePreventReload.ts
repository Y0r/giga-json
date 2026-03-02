import { useEffect } from "react";

/**
 * Hook to prevent the page from reloading when the user presses Ctrl+R (or Cmd+R).
 *
 * @param {() => void} onPrevent - Callback to be called when the reload is prevented.
 */
export const usePreventReload = (onPrevent: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl (or Cmd) key is pressed.
      if (event.ctrlKey || event.metaKey) {
        // Check if 'R' key is pressed (keyCode 82).
        if (event.key === "r" || event.key === "R" || event.keyCode === 82) {
          event.preventDefault();
          event.stopPropagation();
          onPrevent();
        }
      }

      // Also prevent F5.
      if (event.key === "F5" || event.keyCode === 116) {
        event.preventDefault();
        event.stopPropagation();
        onPrevent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Also prevent reload using the beforeunload event.
    // Note: Browser support for custom messages is limited.
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // In modern browsers, custom messages are ignored, but setting returnValue is required.
      event.preventDefault();
      event.returnValue = true;
      return true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onPrevent]);
};
