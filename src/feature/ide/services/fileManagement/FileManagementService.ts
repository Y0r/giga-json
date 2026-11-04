import { EditorFile } from "@/feature/ide/state/ide.types";
import { getFileInfo } from "@/feature/ide/utils/fileUtils";

export const findFileNameCollision = (
  files: Record<string, EditorFile>,
  name: string,
  excludedFileId?: string,
) =>
  Object.values(files).find(
    (file) =>
      file &&
      file.id !== excludedFileId &&
      typeof file.name === "string" &&
      file.name === name,
  );

/** Returns the first unused copy name, keeping the source file's extension. */
export const suggestUniqueCopyName = (
  files: Record<string, EditorFile>,
  sourceName: string,
) => {
  const normalizedSourceName = getFileInfo(sourceName).name;
  const extensionIndex = normalizedSourceName.lastIndexOf(".");
  const hasExtension = extensionIndex > 0;
  const stem = hasExtension
    ? normalizedSourceName.slice(0, extensionIndex)
    : normalizedSourceName;
  const extension = hasExtension
    ? normalizedSourceName.slice(extensionIndex)
    : "";

  let suffix = 1;
  let candidate = `${stem}-copy${extension}`;
  while (findFileNameCollision(files, candidate)) {
    suffix += 1;
    candidate = `${stem}-copy-${suffix}${extension}`;
  }

  return candidate;
};
