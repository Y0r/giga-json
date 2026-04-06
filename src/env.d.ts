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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
