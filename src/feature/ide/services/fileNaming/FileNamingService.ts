import { getFileInfo } from "@/feature/ide/utils/fileUtils";

export const normalizeFileName = (input: string, existingName?: string) => {
  const trimmedName = input.trim();
  if (!trimmedName) return null;

  const hasExtension = trimmedName.lastIndexOf(".") > 0;
  const existingExtensionIndex = existingName?.lastIndexOf(".") ?? -1;
  const existingExtension =
    existingExtensionIndex > 0
      ? existingName?.slice(existingExtensionIndex)
      : "";

  return getFileInfo(
    !hasExtension && existingExtension
      ? `${trimmedName}${existingExtension}`
      : trimmedName,
  );
};
