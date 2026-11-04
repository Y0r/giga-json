import { describe, expect, it } from "vitest";
import { EditorFile } from "@/feature/ide/state/ide.types";
import {
  findFileNameCollision,
  suggestUniqueCopyName,
} from "./FileManagementService";

const file = (id: string, name: string): EditorFile => ({
  id,
  name,
  path: `file://${name}`,
  type: name.split(".").pop() ?? "txt",
  language: "plaintext",
  lastModified: 0,
  cursor: null,
  cursorOffset: 0,
  content: "",
  isClosed: true,
});

describe("FileManagementService", () => {
  it("finds collisions among closed files and can exclude the renamed file", () => {
    const files = { first: file("first", "notes.json") };

    expect(findFileNameCollision(files, "notes.json")?.id).toBe("first");
    expect(findFileNameCollision(files, "notes.json", "first")).toBeUndefined();
  });

  it("suggests an unused copy name while preserving the extension", () => {
    const files = {
      first: file("first", "data.json"),
      second: file("second", "data-copy.json"),
      third: file("third", "data-copy-2.json"),
    };

    expect(suggestUniqueCopyName(files, "data.json")).toBe("data-copy-3.json");
  });

  it("uses the default text extension for extensionless imported files", () => {
    const files = { existing: file("existing", "notes-copy.txt") };

    expect(suggestUniqueCopyName(files, "notes")).toBe("notes-copy-2.txt");
  });
});
