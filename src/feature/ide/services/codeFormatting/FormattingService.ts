import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import * as parserYaml from "prettier/plugins/yaml";
import * as parserEstree from "prettier/plugins/estree";

import { config } from "@/config";

/**
 * Service to handle code formatting using Prettier.
 *
 * Supported formats: JSON, YAML, etc.
 * Note: XML, PHP, Python, and Go require additional plugins.
 */
class FormattingService {
  /**
   * Formats the given code based on its language.
   *
   * @param code - The source code to format.
   * @param language - The language of the code (e.g., 'json', 'yaml').
   * @returns The formatted code.
   */
  public async format(code: string, language: string): Promise<string> {
    if (!config.codeFormattingEnabled) {
      return code;
    }

    const parser = this.getParser(language);
    if (!parser) {
      return code;
    }

    try {
      const options = this.getPrettierOptions(parser);
      return await prettier.format(code, options);
    } catch (error) {
      console.error("Formatting error:", error);
      return code;
    }
  }

  /**
   * Formats the given code based on its language and recalculates the cursor position.
   *
   * @param code - The source code to format.
   * @param language - The language of the code.
   * @param cursorOffset - The current cursor position.
   * @returns The formatted code and the new cursor position.
   */
  public async formatWithCursor(
    code: string,
    language: string,
    cursorOffset: number = 0,
  ): Promise<{ code: string; cursorOffset: number }> {
    if (!config.codeFormattingEnabled) {
      return { code: code, cursorOffset };
    }

    const parser = this.getParser(language);
    if (!parser) {
      return { code: code, cursorOffset };
    }

    try {
      const options = this.getPrettierOptions(parser);
      const result = await prettier.formatWithCursor(code, {
        ...options,
        cursorOffset,
      });

      return {
        code: result.formatted,
        cursorOffset: result.cursorOffset,
      };
    } catch (error) {
      console.error("Formatting error:", error);
      return { code: code, cursorOffset: cursorOffset };
    }
  }

  /**
   * Returns common Prettier options.
   *
   * @param parser - The parser name to use.
   * @returns Prettier options object.
   */
  private getPrettierOptions(parser: string) {
    return {
      parser,
      plugins: [parserBabel, parserYaml, parserEstree],
      useTabs: config.codeFormattingDefaultUseTabs,
      tabWidth: config.codeFormattingDefaultTabWidth,
      semi: config.codeFormattingDefaultSemicolons,
      singleQuote: config.codeFormattingDefaultSingleQuote,
      trailingComma: config.codeFormattingDefaultTrailingComma,
    };
  }

  /**
   * Maps language identifiers to Prettier parsers.
   *
   * @param language - The language identifier.
   * @returns The parser name or null if not supported.
   */
  private getParser(language: string): string | null {
    const languageMap: Record<string, string> = {
      json: "json",
      json5: "json5",
      jsonc: "jsonc",
      yaml: "yaml",
      yml: "yaml",
      javascript: "babel",
      js: "babel",
      typescript: "babel-ts",
      ts: "babel-ts",
    };

    return languageMap[language.toLowerCase()] || null;
  }
}

export const formattingService = new FormattingService();

export default formattingService;
