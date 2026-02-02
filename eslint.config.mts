import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  // Base JS
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // Unicorn
  unicorn.configs.recommended,

  // React
  react.configs.flat.recommended,

  // Project-specific rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
    },
  },
];
