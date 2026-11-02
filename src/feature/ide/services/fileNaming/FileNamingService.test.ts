import { describe, expect, it } from "vitest";
import { normalizeFileName } from "./FileNamingService";

describe("FileNamingService", () => {
  it("trims names and adds the default extension", () => {
    expect(normalizeFileName("  notes  ")?.name).toBe("notes.txt");
  });

  it("rejects blank names", () => {
    expect(normalizeFileName("   ")).toBeNull();
  });
});
