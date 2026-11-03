import { describe, expect, it } from "vitest";
import { normalizeFileName } from "./FileNamingService";

describe("FileNamingService", () => {
  it("trims names and adds the default extension", () => {
    expect(normalizeFileName("  notes  ")?.name).toBe("notes.txt");
  });

  it("preserves an existing extension for a rename without one", () => {
    expect(normalizeFileName("  renamed  ", "original.json")?.name).toBe(
      "renamed.json",
    );
  });

  it("uses an explicitly entered extension for a rename", () => {
    expect(normalizeFileName("renamed.ts", "original.json")?.name).toBe(
      "renamed.ts",
    );
  });

  it("rejects blank names", () => {
    expect(normalizeFileName("   ")).toBeNull();
  });
});
