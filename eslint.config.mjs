import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginAstro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";

const typescriptEslint = tseslint.plugin;
const tsParser = tseslint.parser;

export default tseslint.config(
  {
    ignores: [
      // recursively ignore all dirs named node_modules by prepending **/
      "**/node_modules",
      "**/dist",
      ".git/",
      ".astro/",
      ".prettierrc.mjs",
    ],
  },

  // General setup base with type-aware linting
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // prefer projectServer over setting project manually: https://typescript-eslint.io/getting-started/typed-linting#can-i-customize-the-tsconfig-used-for-typed-linting
        // but using projectService causes an error in .astro files of: 1. Parsing error: Type expected.
        // https://github.com/ota-meshi/astro-eslint-parser/issues/331
        // projectService: true,
        project: ["./tsconfig.json"],
        // @ts-expect-error investigate how to solve and keep tscheck
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
  },

  // React
  {
    files: ["**/*.{jsx,mjsx,tsx,mtsx}"],
    ...reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
    ...reactPlugin.configs.flat["jsx-runtime"], // Add this if you are using React 17+
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/hook-use-state": ["warn", { allowDestructuredState: true }],
      "react/jsx-fragments": ["warn", "element"],
    },
  },

  // jsx a11y
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Astro
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  // Disable typed rules for scripts inside Astro files
  // https://github.com/ota-meshi/eslint-plugin-astro/issues/240
  {
    files: ["**/*.astro/*.ts"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    ...tseslint.configs.disableTypeChecked,
  },

  // Remove some safety rules because not all code is perfectly typed
  {
    files: [
      "**/*.astro", // eslint-plugin-astro doesn't type Astro.props correctly in some contexts, so a bunch of things ends up being any
      "eslint.config.mjs",
    ],
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },

  // General rules
  {
    rules: {
      "prefer-const": "warn",
      "astro/no-unused-css-selector": "error",
      "astro/prefer-object-class-list": "error",
      "astro/jsx-a11y/lang": "error",
      "jsx-a11y/lang": "error",
      // Note: you must disable the base rule as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Escape hatch
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // turn off rules that conflict with the prettier formatter
  eslintConfigPrettier,
);
