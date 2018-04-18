---
title: Automagically lint and format your code
date: "2018-04-08"
---

We'll set up our editor to [lint](<https://en.wikipedia.org/wiki/Lint_(software)>) and format our code automatically, leaving us free to think about the functionality of our code. Not whether or not a variable is defined or if we should insert a space.

To achieve this goal we'll use 2 powerful tools.

* The linting part will be handled by [ESLint](https://eslint.org/)
* The formatting part will be handled by [Prettier](https://prettier.io/)

On their own, those tools are very powerful.  
Combined, they will make you feel like you have superpowers.

## Initial Setup

To get started we'll install [Visual Studio Code](https://code.visualstudio.com/) as editor.

We'll also install the 2 extensions for our editor:
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

Let's try this on a [GatsbyJS](https://www.gatsbyjs.org/) project.

After bootstrapping our project, open VSCode in the newly created directory and delete some files we won't use: `yarn.lock` (we'll use `npm`) and `.prettierrc` (those options will live inside an other configuration file)

```sh
gatsby new automagically-lint
cd automagically-lint
code .
```

### Configure editor settings

Before continuing, we'll set up VSCode to perform linting and formatting tasks each time a file is saved.

Go to the user-settings (`file > preferences > settings`)

* Tell VSCode to format the document every time we save a file.
* Explicitly disable fomatting for javascript files, as we will format through ESLint.
* Run ESLint on each save (with the `--fix` flag).
* Tell ESLint to always show us its status to stay informed.

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

Now Prettier wil run on all file formats it supports except for JavaScript, those files will be handled by ESLint

## Starting with ESLint

We'll install everything we need locally, so the machine we develop on doesn't matter. Don't worry, there's no magic here, I'll briefly explain what each package does.

Start with installing our main linting package, [ESLint](https://www.npmjs.com/package/eslint)

```sh
npm i eslint -D
```

We don't need to install our main formatting package, [Prettier](https://www.npmjs.com/package/prettier), since that comes bundled with the Gatsby project we started.

Since ESLint is installed locally, we'll initialize it from the node modules folder, we'll use a popular set of rules, the [Airbnb Style Guide](https://github.com/airbnb/javascript) configuration.

```sh
./node_modules/.bin/eslint --init
```

* Answer `Use a popular style guide` to the question how you would like to configure ESLint

* Choose `Airbnb` when asked which style guide

* Enter `Y` when asked if you use React

* Lastly we'll create our rules-file in the `JSON` format

This process will create a `.eslintrc.json` file in the root folder of your project. It will also install the dependencies needed for our chosen styleguide.

### Adding the power of Prettier

The problem we are faced with if we want to combine ESLint and Prettier is that some rules exist in both packages, causing conflicts between the two.

To prevent the conflicts we'll install and configure the [Prettier config package for ESLint](https://github.com/prettier/eslint-config-prettier).
This package disables all formatting-related ESLint rules.

```sh
npm i eslint-config-prettier -D
```

We'll use this by adding it to our `.eslintrc.json` file
It now looks like this

```json
{
  "extends": ["airbnb", "prettier", "prettier/react"]
}
```

next up is the [Prettier plugin package for ESLint](https://github.com/prettier/eslint-plugin-prettier)

```sh
npm i eslint-plugin-prettier -D
```

This will run Prettier as an ESLint rule and reports differences as individual ESLint issues.

To use it we'll add this to our `.eslintrc.json` file

```json
"plugins": [
  "prettier"
],
"rules": {
  "prettier/prettier": "error"
}
```

### Dictating our own rules

While the Airbnb configuration contains an excellent set of rules, we'll make this linting/formatting setup our own and use the existing configuation as a starting point.

Let's add some rules specific to Prettier in our ESLint configuration

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

The code snippets above are examples of what you could do, check out the configuration options for [Prettier](https://prettier.io/docs/en/options.html) and for [ESLint](https://eslint.org/docs/user-guide/configuring)

### Some special configuration for Gatsby

In this specific case (project bootstrapped by Gatsby v1), we'll add the React package that is injected by Gatsby to our core-modules so ESLint doesn't warn us about the imports not existing

In our `.eslintrc.json` file

```json
"settings": {
    "import/core-modules": [
        "react"
    ]
}
```

Gatsby also supports the use of `graphql` while it's undefined. ESLint doesn't like that (more specifically the no-undef rule).
More info available [here](https://www.gatsbyjs.org/tutorial/part-four/#wait--where-did-the-graphql-tag-come-from).
In Gatsby v2 this won't be an issue anymore thanks to their own [ESLint webpack loader](https://github.com/gatsbyjs/gatsby/pull/4893).
For now, I just disable the no-undef rule for one line.

In the `layouts/index.js` file

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

We successfully set up ESLint to work together with Prettier.
We get notified in our editor about linting problems that ESLint picks up and about formatting problems that Prettier picks up.
Each time we save a `.js` file those 2 packages will work together and fix all the issues that they can (as it turns out, that's quite a lot of them).

Go and write some beautiful code!
