/**
 * @file
 * Provides schema for the `import.meta.env` object.
 */

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_DEV: boolean;
  readonly VITE_DEBUG_MODE: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
