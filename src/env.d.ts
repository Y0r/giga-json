/**
 * @file
 * Provides schema for the `import.meta.env` object.
 */

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DEV: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_DEBUG_FILE_CREATION: string;
  readonly VITE_DEBUG_EDITOR_EVENTS: string;
  readonly VITE_DEBUG_DISPLAY_ERRORS: string;
  readonly IDE_CHANGES_SYNC_DELAY: number;
  readonly IDE_ON_SHORTCUT_PREVENT_ALL: string;
  readonly IDE_ON_SHORTCUT_PREVENT_BROWSER_RELOAD: string;
  readonly IDE_ON_SHORTCUT_PREVENT_BROWSER_SAVE_AS: string;
  readonly IDE_ON_SHORTCUT_PREVENT_EDITOR_SEARCH: string;
  readonly IDE_CODE_FORMATTING_ENABLED: string;
  readonly IDE_CODE_FORMATTING_DEFAULT_USE_TABS: string;
  readonly IDE_CODE_FORMATTING_DEFAULT_TAB_WIDTH: string;
  readonly IDE_CODE_FORMATTING_DEFAULT_SEMICOLONS: string;
  readonly IDE_CODE_FORMATTING_DEFAULT_SINGLE_QUOTE: string;
  readonly IDE_CODE_FORMATTING_DEFAULT_TRAILING_COMMA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
