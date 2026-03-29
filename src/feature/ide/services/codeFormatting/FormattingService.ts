import * as prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserYaml from "prettier/parser-yaml";

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
    console.log("Formatting code... for language:" + language);
    const parser = this.getParser(language);

    if (!parser) {
      console.warn(`No formatter available for language: ${language}`);
      return code;
    }

    console.log("Parser:" + parser);

    // try {
    return await prettier.format(code, {
      parser,
      plugins: [parserBabel, parserYaml],
      // Additional Prettier options can be configured here.
      semi: true,
      singleQuote: false,
      tabWidth: 2,
    });
    // } catch (error) {
    //   console.error("Formatting error:", error);
    //   return code;
    // }
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
