import { getFileInfo } from "@/feature/ide/utils/fileUtils";

export const normalizeFileName = (input: string) => {
  const trimmedName = input.trim();
  if (!trimmedName) return null;

  return getFileInfo(trimmedName);
};
