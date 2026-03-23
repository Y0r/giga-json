type KeyCombo = string[];
type ShortcutAction = () => void;

export interface Shortcut {
  keys: KeyCombo;
  action: ShortcutAction;
  isDoublePress?: boolean;
}

/**
 * ShortcutService is a centralized management system for keyboard shortcuts in the IDE.
 *
 * It listens for global 'keydown' events, detects combinations (e.g., Ctrl+R),
 * manages a registry of shortcuts with priority (last registered, first checked),
 * and supports double-press actions (e.g., "Double Shift").
 *
 * @example
 * // Manual registration
 * const unregister = shortcutService.register({
 *   keys: ['ctrl', 's'],
 *   action: () => saveFile()
 * });
 *
 * // Clean up manually later
 * unregister();
 */
class ShortcutService {
  private shortcuts: Shortcut[] = [];
  private lastKeyPress: { key: string; time: number } | null = null;
  private DOUBLE_PRESS_DELAY = 300; // ms

  /**
   * Initializes the global event listener for keyboard events.
   */
  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown, true);
    }
  }

  /**
   * Registers a new shortcut in the system.
   *
   * Shortcuts are added to the beginning of the registry, giving them higher priority.
   *
   * @param shortcut - The shortcut configuration.
   * @returns An unregister function to remove the shortcut from the system.
   */
  register(shortcut: Shortcut) {
    this.shortcuts.unshift(shortcut); // Add to beginning (highest priority)
    return () => {
      this.shortcuts = this.shortcuts.filter((s) => s !== shortcut);
    };
  }

  /**
   * Global event handler for keydown events.
   *
   * Detects single key presses, combinations, and double-presses.
   * If a matching shortcut is found, it prevents the default browser behavior
   * and executes the shortcut's action.
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    const pressedKeys = this.getPressedKeys(event);
    const now = Date.now();
    const eventKey = event.key.toLowerCase();

    // Check for double-press (e.g., Shift after Shift)
    const isDouble =
      this.lastKeyPress &&
      this.lastKeyPress.key === eventKey &&
      now - this.lastKeyPress.time < this.DOUBLE_PRESS_DELAY;

    this.lastKeyPress = { key: eventKey, time: now };

    const match = this.shortcuts.find((s) => {
      if (s.isDoublePress) {
        return (
          isDouble &&
          s.keys.length === 1 &&
          s.keys[0].toLowerCase() === eventKey
        );
      }

      // Check for normal combo
      // For single keys like F5, pressedKeys will contain ["f5"]
      // For combinations like Ctrl+R, pressedKeys will contain ["r", "ctrl"]
      if (s.keys.length !== pressedKeys.length) return false;

      return s.keys.every((k) => pressedKeys.includes(k.toLowerCase()));
    });

    if (match) {
      event.preventDefault();
      event.stopPropagation();
      match.action();
    }
  };

  /**
   * Normalizes and collects all currently pressed keys from a keyboard event.
   *
   * Standardizes modifier keys to 'ctrl', 'meta', 'shift', 'alt' and returns
   * a sorted/deduplicated list of keys.
   *
   * @param event - The keyboard event to analyze.
   * @returns An array of normalized key strings.
   */
  private getPressedKeys(event: KeyboardEvent): string[] {
    const keys: string[] = [];
    const key = event.key.toLowerCase();

    // Don't add modifier keys to the keys array if they are the only ones,
    // unless they are part of a combination.
    // However, for Shift+Shift, we need to know Shift was pressed.

    // Standardize modifier names
    if (event.ctrlKey) keys.push("ctrl");
    if (event.metaKey) keys.push("meta");
    if (event.shiftKey) keys.push("shift");
    if (event.altKey) keys.push("alt");

    // Add the actual key if it's not already in the list (as a modifier)
    const modifierKeys = ["control", "shift", "alt", "meta"];
    if (!modifierKeys.includes(key)) {
      keys.push(key);
    } else {
      // If only a modifier is pressed, event.key will be "Control", "Shift", etc.
      // We already added "ctrl", "shift", etc. based on the boolean flags.
      // To avoid duplicates and keep it consistent:
      if (key === "control" && !keys.includes("ctrl")) keys.push("ctrl");
      if (key === "shift" && !keys.includes("shift")) keys.push("shift");
      if (key === "alt" && !keys.includes("alt")) keys.push("alt");
      if (key === "meta" && !keys.includes("meta")) keys.push("meta");
    }

    return Array.from(new Set(keys));
  }
}

export const shortcutService = new ShortcutService();
