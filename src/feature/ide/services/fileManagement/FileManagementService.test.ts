import { describe, expect, it } from "vitest";
import { EditorFile } from "@/feature/ide/state/ide.types";
import { findFileNameCollision } from "./FileManagementService";

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
});
