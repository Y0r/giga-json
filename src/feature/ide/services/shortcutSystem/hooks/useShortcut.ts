import { useEffect, useRef } from "react";
import { shortcutService } from "@/feature/ide/services/shortcutSystem/ShortcutService";

/**
 * Custom React hook to register a keyboard shortcut within the IDE's Shortcut Management System.
 *
 * This hook automatically handles shortcut registration on mount and unregistration on unmount.
 * It uses a ref for the action callback to ensure that the shortcut always executes the
 * latest version of the action without needing to re-register the shortcut when the action changes.
 *
 * @param keys - An array of keys that form the shortcut (e.g., ['ctrl', 'r'] or ['shift']).
 *               Supported modifiers: 'ctrl', 'meta', 'shift', 'alt'.
 * @param action - The callback function to execute when the shortcut is triggered.
 * @param options - Additional options for the shortcut.
 * @param options.isDoublePress - If true, the shortcut will only trigger on a rapid double-press
 *                                (within 300ms) of the specified key(s).
 *                                Commonly used for "Double Shift" actions.
 *
 * @example
 * // Basic combination
 * useShortcut(['ctrl', 'r'], () => console.log('Reloading...'));
 *
 * @example
 * // Double press action
 * useShortcut(['shift'], () => console.log('Search opened'), { isDoublePress: true });
 */
export const useShortcut = (
  keys: string[],
  action: () => void,
  options: { isDoublePress?: boolean; enabled?: boolean } = {},
) => {
  const { enabled = true, isDoublePress } = options;
  const actionRef = useRef(action);

  useEffect(() => {
    actionRef.current = action;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return shortcutService.register({
      keys,
      action: () => actionRef.current(),
      isDoublePress,
    });
  }, [keys, isDoublePress, enabled]);
};
