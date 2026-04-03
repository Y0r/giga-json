import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import * as parserYaml from "prettier/plugins/yaml";
import * as parserEstree from "prettier/plugins/estree";

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
    const parser = this.getParser(language);

    if (!parser) {
      return code;
    }

    try {
      return await prettier.format(code, {
        parser,
        plugins: [parserBabel, parserYaml, parserEstree],
        // Additional Prettier options can be configured here.
        // @todo add prettier options per file type/lang type.
        semi: true,
        singleQuote: true,
        tabWidth: 2,
      });
    } catch (error) {
      console.error("Formatting error:", error);
      return code;
    }
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
