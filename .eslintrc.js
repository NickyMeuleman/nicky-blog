/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
    jest: true,
  },
  globals: {
    Atomics: `readonly`,
    SharedArrayBuffer: `readonly`,
    cy: true,
    Cypress: true,
  },
  extends: [
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:react/jsx-runtime`,
    `plugin:react-hooks/recommended`,
    `prettier`, // config-prettier disables eslint rules that conflict with prettier
  ],
  settings: {
    react: {
      version: `detect`,
    },
  },
  parser: `@babel/eslint-parser`,
  plugins: [`react`, `react-hooks`, `prettier`],
  ignorePatterns: [`*.mdx`],
  rules: {
    "react/prop-types": `off`,
    // sx is no longer typed on jsx elements, but it's there if you do the pragme
    // https://github.com/system-ui/theme-ui/issues/1307
    "react/no-unknown-property": [`error`, { ignore: [`sx`] }],
    "no-unused-vars": [
      `error`,
      { vars: `local`, args: `none`, varsIgnorePattern: `jsx` },
    ],
    quotes: [`warn`, `backtick`],
    "prettier/prettier": `warn`,
  },
};

module.exports = eslintConfig;
