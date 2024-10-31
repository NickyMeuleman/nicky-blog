import globals from "globals";
import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginAstro from "eslint-plugin-astro";
import configPrettier from "eslint-config-prettier";

export default eslintTs.config(
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,astro}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  {
    files: ["**/*.astro"],
    ...pluginAstro.configs.recommended,
    ...pluginAstro.configs["jsx-a11y-recommended"],
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    ...pluginReact.configs.flat["jsx-runtime"], // for React 17+ (it no longer requires the React import etc)
  },
  configPrettier,
  {
    rules: {
      "prefer-const": ["warn"],
    },
  },
);
