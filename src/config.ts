const env = import.meta.env;

export const config = {
  appName: env.VITE_APP_NAME ?? "giga_json",
  dev: toBool(env.VITE_DEV),
  debugMode: toBool(env.VITE_DEBUG_MODE),
  debugFileCreation: toBool(env.VITE_DEBUG_FILE_CREATION),
  debugDisplayErrors: toBool(env.VITE_DEBUG_DISPLAY_ERRORS),
};

/**
 * Converts a string to a boolean value.
 */
function toBool(value: string) {
  if (!value) return false;

  value = value.trim().toLowerCase();
  return value === "true";
}
