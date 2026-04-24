import { describe, it, expect, vi } from "vitest";
import { formattingService } from "./FormattingService";
import { config } from "@/config";

describe("FormattingService", () => {
  describe("format", () => {
    it("should format code without cursor", async () => {
      const code = '{"a":1}';
      const language = "json";

      const formatted = await formattingService.format(code, language);

      expect(formatted).toContain('"a": 1');
    });

    it("should format YAML code", async () => {
      const code = "a: 1\nb: 2";
      const language = "yaml";

      const formatted = await formattingService.format(code, language);

      expect(formatted).toContain("a: 1");
      expect(formatted).toContain("b: 2");
    });

    it("should format TypeScript code", async () => {
      const code = "const a:number=1;const b:string='2'";
      const language = "typescript";

      const formatted = await formattingService.format(code, language);

      expect(formatted).toContain("const a: number = 1;");
      expect(formatted).toContain("const b: string = '2';");
    });

    it("should return original code if formatting fails", async () => {
      const code = '{"a": 1'; // Invalid JSON
      const language = "json";

      // Mock console.error to avoid noise in tests
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const formatted = await formattingService.format(code, language);

      expect(formatted).toBe(code);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("formatWithCursor", () => {
    it("should format code and recalculate cursor position", async () => {
      const code = '{"a":1,  "b":2}';
      const language = "json";
      const cursorOffset = 7; // after "a":1

      const result = await formattingService.formatWithCursor(
        code,
        language,
        cursorOffset,
      );

      expect(result).toBeDefined();
      expect(result.code).toContain('"a": 1');
      expect(result.code).toContain('"b": 2');
      expect(typeof result.cursorOffset).toBe("number");
    });

    it("should return original code and cursor if language is not supported", async () => {
      const code = "some code";
      const language = "unsupported";
      const cursorOffset = 5;

      const result = await formattingService.formatWithCursor(
        code,
        language,
        cursorOffset,
      );

      expect(result.code).toBe(code);
      expect(result.cursorOffset).toBe(cursorOffset);
    });

    it("should return original code if formatting is disabled", async () => {
      const code = '{"a":1}';
      const language = "json";
      const cursorOffset = 3;

      const originalEnabled = config.codeFormattingEnabled;
      config.codeFormattingEnabled = false;

      try {
        const result = await formattingService.formatWithCursor(
          code,
          language,
          cursorOffset,
        );

        expect(result.code).toBe(code);
        expect(result.cursorOffset).toBe(cursorOffset);
      } finally {
        config.codeFormattingEnabled = originalEnabled;
      }
    });

    it("should use default cursor offset if not provided", async () => {
      const code = '{"a":1}';
      const language = "json";

      const result = await formattingService.formatWithCursor(code, language);

      expect(result.code).toContain('"a": 1');
      expect(typeof result.cursorOffset).toBe("number");
    });
  });
});
