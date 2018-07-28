---
title: Linting and formatting CSS
date: "2018-07-27"
author: "Nicky Meuleman"
cover: './cover.jpg'
---

THIS IS A DRAFT, it's already online, but not finished yet.

We'll set up linting and formatting for our styles.

In a previous post I went over [how to lint and format you JavaScript](/blog/automagically-lint). Now, we'll achieve similar superpowers, but for our styles (CSS, SCSS, Less, sss, ...).
We'll use [Stylelint](https://stylelint.io) as our linting tool and [Prettier](https://prettier.io) as our (main) formatting tool.

## Initial Setup

To start linting your styles, you don't need any fancy setup.
The tools we'll use are on [npm](https://www.npmjs.com/), so we'll define those in a `package.json` file, that's it. The rest of the demo-application consists of a single `index.html` and a `styles.css` file.

```sh
npm init -y
```

After creating a standard package.json file we can install the main tools we'll use.

```sh
npm i -D stylelint prettier
```

We'll start with a popular set of rules for stylelint

```sh
npm i -D stylelint-config-standard
```

To configure StyleLint to use there rules,
create a `.stylelintrc.json` file in the root directory.

```json
{
  "extends": ["stylelint-config-standard"]
}
```

It works! Let's show you it works.
Add this to you `package.json`

```json{3}
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint:css": "stylelint *.css"
  }
```

You can now run `npm run lint:css` in the terminal and stylelint will run for every `.css` file it finds.
If it finds errors, you will see a bunch of `npm ERR!`s in the console, don't worry, that's expected, the linting errors it found are above them.
If you would prefer not the have all those npm errors, you could also run that command without using that script we just declared.

```sh
./node_modules/.bin/stylelint *.css
```

## Add Prettier

Our styles should also have consistent formatting, consistency makes things easier to read.
We'll set up Stylelint to report formatting issues that Prettier picks up.

```sh
npm i -D stylelint-prettier
```

After installing it, we can add it to our `.stylelintrc`

```json{2-5}
{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  },
  "extends": ["stylelint-config-standard"]
}
```

When you run `lint:css` now you'll see additional errors reported by the `prettier/prettier` rule.

It's possible that the rules inside your `extends` array, or rules you define explicitly, conflict with Prettier, causing a catch-22 situation.

We'll turn off all Stylelint rules specific to formatting and let Prettier handle them by adding `stylelint-config-prettier`.

```sh
npm i -D stylelint-config-prettier
```

```json{6}
{
  "plugins": ["stylelint-prettier"],
  "rules": {
    "prettier/prettier": true
  },
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```
