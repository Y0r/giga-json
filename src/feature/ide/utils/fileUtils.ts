import mime from "mime/lite";

/**
 * Determines metadata for a given filename including name, MIME type, and Monaco language.
 *
 * If the filename lacks an extension, it defaults to `.txt`. The MIME type is
 * looked up using the `mime` package, and the Monaco language identifier
 * is derived from the filename and MIME type.
 *
 * @param filename - The original filename provided by the user.
 * @returns An object containing the processed filename, MIME type, and Monaco language identifier.
 */
export const getFileInfo = (filename: string) => {
  const hasExtension = filename.includes(".");
  const name = hasExtension ? filename : `${filename}.txt`;
  const mimeType = mime.getType(name) || "text/plain";
  const language = getLanguage(name, mimeType);

  return {
    name,
    mimeType,
    language,
  };
};

/**
 * Resolves the Monaco language identifier for a given file.
 *
 * Prioritizes common file extensions (e.g., `.js`, `.ts`, `.json`) to ensure
 * accurate language detection. If the extension is unknown, it falls back to
 * predefined MIME type mappings. If no match is found, defaults to `plaintext`.
 *
 * @param filename - The name of the file used to extract the extension.
 * @param mimeType - The MIME type of the file as an additional lookup key.
 * @returns A string representing the language identifier compatible with Monaco Editor.
 */
export const getLanguage = (filename: string, mimeType: string): string => {
  // Common extension mappings take precedence because some mime types are ambiguous or missing
  const extension = filename.split(".").pop()?.toLowerCase();

  const extensionMap: Record<string, string> = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    less: "less",
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    py: "python",
    cpp: "cpp",
    cc: "cpp",
    h: "cpp",
    hpp: "cpp",
    java: "java",
    cs: "csharp",
    rb: "ruby",
    go: "go",
    rs: "rust",
    php: "php",
    sh: "shell",
    sql: "sql",
    txt: "plaintext",
  };

  if (extension && extensionMap[extension]) {
    return extensionMap[extension];
  }

  // Direct mime type mappings as fallback
  const mimeMap: Record<string, string> = {
    "application/json": "json",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "javascript",
    "application/javascript": "javascript",
    "text/typescript": "typescript",
    "application/typescript": "typescript",
    "text/markdown": "markdown",
    "text/x-markdown": "markdown",
    "image/svg+xml": "xml",
  };

  if (mimeMap[mimeType]) {
    return mimeMap[mimeType];
  }

  // Basic fallback to plaintext
  return "plaintext";
};
