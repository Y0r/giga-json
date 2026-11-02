import { EditorFile } from "@/feature/ide/state/ide.types";

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
