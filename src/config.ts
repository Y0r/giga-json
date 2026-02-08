export const config = {
  appName: import.meta.env.VITE_APP_NAME ?? "giga_json",
  dev: import.meta.env.VITE_DEV ?? true,
  debugMode: import.meta.env.VITE_DEBUG_MODE ?? false,
  debugDisplayErrors: import.meta.env.VITE_DISPLAY_ERRORS ?? false,
};
