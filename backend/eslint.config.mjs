import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "function" },
      ],
    },
  },
]);
