/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintPluginAstro from "eslint-plugin-astro";

export default tseslint.config(
  // General setup base with type-aware linting
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // prefer projectServer over settint project manually: https://typescript-eslint.io/getting-started/typed-linting#can-i-customize-the-tsconfig-used-for-typed-linting
        // but using projectService causes an error in .astro files of 1. Parsing error: Type expected.
        // https://github.com/ota-meshi/astro-eslint-parser/issues/259
        projectService: true,
        // @ts-expect-error investigate how to solve and keep tscheck
        tsconfigRootDir: import.meta.dirname,
      },
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
      ...reactHooksPlugin.configs.recommended.rules,
      "react/hook-use-state": ["warn", { allowDestructuredState: true }],
      "react/jsx-fragments": ["warn", "element"],
    },
  },

  // Astro
  ...eslintPluginAstro.configs.recommended,
  // {
  //   files: ["**/*.astro"],
  //   rules: {
  //     ...eslintPluginAstro.rules,
  //     "astro/no-unused-css-selector": "error",
  //   },
  // },

  // Disable typed rules for scripts inside Astro files
  // https://github.com/ota-meshi/eslint-plugin-astro/issues/240
  {
    files: ["**/*.astro/*.ts"],
    ...tseslint.configs.disableTypeChecked,
  },

  // General rules
  {
    rules: {
      "prefer-const": "warn",
      // not working yes, maybe because of projectService?
      "astro/no-unused-css-selector": "error",
      "astro/prefer-object-class-list": "error",
    },
  },
);
