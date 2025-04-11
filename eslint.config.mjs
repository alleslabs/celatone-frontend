import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/.next",
    "**/.pnpm-store",
    "**/pnpm-lock.yaml",
    "**/node_modules",
    "**/dist",
  ]),
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-undef": "off",
      "no-console": "error",
      "no-unused-vars": "off",
      strict: ["error", "global"],
      "consistent-return": "error",
      "no-else-return": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-use-before-define": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      semi: "error",
    },
  },
  // React
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      "react/jsx-sort-props": "off",
    },
  },
  // React Hooks
  reactHooks.configs["recommended-latest"],
  // TypeScript
  tseslint.configs.recommended,
  tseslint.config({
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "always" },
      ],
    },
  }),
  // Perfectionist
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          groups: [
            "side-effect",
            "side-effect-style",
            "type",
            ["builtin", "external"],
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
        },
      ],
      "perfectionist/sort-jsx-props": [
        "error",
        {
          groups: [
            "key",
            "id",
            "classname",
            "style",
            "unknown",
            "callback",
            "ref",
          ],
          customGroups: {
            key: "^key$",
            id: "^id$",
            ref: "^ref$",
            classname: "^className$",
            style: "^style$",
            callback: "^on.+",
          },
        },
      ],
    },
  },
]);
