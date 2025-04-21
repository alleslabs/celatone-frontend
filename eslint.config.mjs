import js from "@eslint/js";
import { flatConfig as next } from "@next/eslint-plugin-next";
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
    extends: ["js/recommended"],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    rules: {
      "consistent-return": "error",
      eqeqeq: "error",
      "no-console": "error",
      "no-else-return": "error",
      "no-param-reassign": ["error", { props: true }],
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      semi: "error",
      strict: ["error", "global"],
    },
  },
  // React
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react,
    },
    rules: {
      "react/jsx-sort-props": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  // React Hooks
  reactHooks.configs["recommended-latest"],
  // Next.js
  {
    ...next.recommended,
    settings: {
      next: {
        rootDir: "./src/",
      },
    },
  },
  // TypeScript
  tseslint.configs.recommended,
  tseslint.config({
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "always" },
      ],
      "@typescript-eslint/no-unused-vars": "error",
    },
  }),
  // Perfectionist
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-exports": [
        "error",
        {
          order: "asc",
        },
      ],
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
          customGroups: {
            callback: "^on.+",
            classname: "^className$",
            id: "^id$",
            key: "^key$",
            ref: "^ref$",
            style: "^style$",
          },
          groups: [
            "key",
            "id",
            "classname",
            "style",
            "unknown",
            "callback",
            "ref",
          ],
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
        },
      ],
    },
  },
]);
