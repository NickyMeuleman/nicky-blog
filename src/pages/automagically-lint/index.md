---
title: Automagically lint and format your code
date: "2018-04-08"
---

## Linting and formatting JavaScript

The goal is to automatically check our javascript files for linting errors and formatting errors. It would also be nice to fix those on each save.

### Initial Setup

To get started we'll install [Visual Studio Code](https://code.visualstudio.com/) as editor.

To complete this tutorial we'll also need
2 extensions.
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Let's try this on a [GatsbyJS](https://www.gatsbyjs.org/) project.

After bootstrapping our project with

```sh
gatsby new automagically-lint
```

Open VSC in the newly created directory and delete some files we won't use
`yarn.lock` (we'll use `npm`) and `.prettierrc` (those options will live inside an other configuration file)

### Configure some editor settings

Inside VSC, go to the user-settings (`file>preferences>settings`)

Tell VSC to format the document every time we save a file.

Explicitly disable fomatting for javascript files, as we will format through ESLint.

Since we disabled formatting for javascript files each save, we can enable the ESLint extension.

Tell ESLint to always show us its status to stay informed.

```json
    "editor.formatOnSave": true,
    "[javascript]": {
      "editor.formatOnSave": false
    },
    "prettier.disableLanguages": [
    "js"
    ],
    "eslint.autoFixOnSave": true,
    "eslint.alwaysShowStatus": true,
```

Now Prettier wil run on all file formats it supports except for javascript, that will be handled through ESLint

## Starting with ESLint

We'll install everything we need locally, so the machine we develop on doesn't matter. Don't worry, there's no magic here, I'll briefly explain what each package does.

Start with installing ESLint

```sh
npm i eslint -D
```

We don't need to install Prettier since that already comes bundled with Gatsby.

Since we installed eslint locally, we'll initialize it from the node modules, we'll go with the AirBnB rules

```sh
./node_modules/.bin/eslint --init
```

* Answer `Use a popular style guide` to the question how you would like to configure ESLint

* `Airbnb` when asked which style guide

* enter `Y` when asked if you use React

* Lastly we'll create our rules-file in the `JSON` format

This process will create a `.eslintrc.json` file in the root folder of your project, it will also install the dependencies needed for our chose styleguide.

### Adding the power of Prettier

The problem we are faced with if we want to combine ESLint and Prettier is that some rules exist in both extension, causing conflicts between the two.

To prevent the conflicts we'll install and configure `eslint-config-prettier`.
This package disables all formatting-related ESLint rules.

```sh
npm i eslint-config-prettier -D
```

We'll use this by adding it to our `eslintrc.json` file
It now looks like this

```json
{
  "extends": ["airbnb", "prettier", "prettier/react"]
}
```

next up is the `eslint-plugin-prettier`

```sh
npm i eslint-plugin-prettier -D
```

This will run prettier as an ESLint rule and reports differences as individual ESLint issues.

To use it we'll add this to our `.eslintrc` file

```json
"plugins": [
  "prettier"
],
"rules": {
  "prettier/prettier": "error"
}
```

### Dictating our own rules

While the Airbnb configuration contains an excellent set of rules, we'll make this our own and use the existing configuation as a starting point

Let's add some rules specific to prettier in our ESLint configuration

```json
"prettier/prettier": [
    "error",
    {
        "singleQuote": true,
        "printWidth": 120,
        "trailingComma": "es5"
    }
]
```

Next we'll override some of the rules set by the Airbnb styleguide

```json
"react/jsx-filename-extension": [
    1,
    {
        "extensions": [
            ".js",
            ".jsx"
        ]
    }
],
"react/prop-types": 0,
"no-unused-vars": [
    "error",
    {
        "vars": "local",
        "args": "none"
    }
],
"jsx-a11y/anchor-is-valid": [
    "error",
    {
        "components": [
            "Link"
        ],
        "specialLink": [
            "to",
            "hrefLeft",
            "hrefRight"
        ],
        "aspects": [
            "noHref",
            "invalidHref",
            "preferButton"
        ]
    }
]
```

### Some special configuration for Gatsby

In this specific case (project bootstrapped by Gatsby v1), we'll add some imports that are injected to our core-modules so ESLint doesn't warn us about the imports not existing

```json
"settings": {
    "import/core-modules": [
        "react"
    ]
}
```

Gatsby also supports the use of `graphql` while it's undefined. ESLint doesn't like that (more specifically the no-undef rule).
More info available [here](https://www.gatsbyjs.org/tutorial/part-four/#wait--where-did-the-graphql-tag-come-from)
In Gatsby v2 this won't be an issue anymore thanks to their own [ESLint webpack loader](https://github.com/gatsbyjs/gatsby/pull/4893).
For now, I just disable the no-undef rule for one line.
In the layouts/index.js file

```js
// eslint-disable-next-line no-undef
export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
```

We successfully set up ESLint to work together with prettier.
Go and write some beautiful code!
