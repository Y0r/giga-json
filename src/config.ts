const env = import.meta.env;

export const config = {
  appName: env.VITE_APP_NAME ?? "giga_json",
  dev: toBool(env.VITE_DEV),
  // Debug variables.
  debugMode: toBool(env.VITE_DEBUG_MODE),
  debugFileCreation: toBool(env.VITE_DEBUG_FILE_CREATION),
  debugEditorEvents: toBool(env.VITE_DEBUG_EDITOR_EVENTS),
  debugDisplayErrors: toBool(env.VITE_DEBUG_DISPLAY_ERRORS),
  // Editor variables.
  changesSyncDelay: env.IDE_CHANGES_SYNC_DELAY ?? "500",
  // Shortcut variables.
  onShortcutPreventAll: toBool(env.IDE_ON_SHORTCUT_PREVENT_ALL),
  onShortcutPreventBrowserReload: toBool(
    env.IDE_ON_SHORTCUT_PREVENT_BROWSER_RELOAD,
  ),
  onShortcutPreventBrowserSaveAs: toBool(
    env.IDE_ON_SHORTCUT_PREVENT_BROWSER_SAVE_AS,
  ),
  onShortcutPreventEditorSearch: toBool(
    env.IDE_ON_SHORTCUT_PREVENT_EDITOR_SEARCH,
  ),
  // Code formatting variables.
  codeFormattingEnabled: toBool(env.IDE_CODE_FORMATTING_ENABLED),
  codeFormattingDefaultUseTabs: toBool(
    env.IDE_CODE_FORMATTING_DEFAULT_USE_TABS,
  ),
  codeFormattingDefaultTabWidth:
    parseInt(env.IDE_CODE_FORMATTING_DEFAULT_TAB_WIDTH) ?? 2,
  codeFormattingDefaultSingleQuote: toBool(
    env.IDE_CODE_FORMATTING_DEFAULT_SINGLE_QUOTE,
  ),
  codeFormattingDefaultSemicolons: toBool(
    env.IDE_CODE_FORMATTING_DEFAULT_SEMICOLONS,
  ),
  codeFormattingDefaultTrailingComma: toTrailingComma(
    env.IDE_CODE_FORMATTING_DEFAULT_TRAILING_COMMA,
  ),
};

/**
 * Converts a string to a boolean value.
 */
function toBool(value: string) {
  if (!value) return false;

  value = value.trim().toLowerCase();
  return value === "true";
}

/**
 * Converts a string to a valid Prettier trailing comma value.
 */
function toTrailingComma(value: string | undefined): "all" | "es5" | "none" {
  const allowed = ["all", "es5", "none"];
  if (value && allowed.includes(value.trim().toLowerCase())) {
    return value.trim().toLowerCase() as "all" | "es5" | "none";
  }

  return "all";
}
