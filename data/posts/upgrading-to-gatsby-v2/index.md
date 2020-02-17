---
title: Upgrading to Gatsby v2
date: '2018-06-28'
authors: ["nicky"]
cover: './cover.jpg'
tags: ['GatsbyJS', 'Howto']
---

<!-- Photo by Pietro De Grandi on Unsplash -->

Gatsby has a great guide for upgrading from v1 to v2.
This post describes how I upgraded this site from v1 to v2. If it reads almost identically to their [official guide](https://next.gatsbyjs.org/docs/migrating-from-v1-to-v2/), it's because their guide is awesome. _if it doesn't, their guide is still awesome_.

Before I got started, I created a new branch in git where all changed would live.
This branch will get merged into the master branch after this post 💪.

```bash
git checkout -b gatsby-v2
```

## Remove `gatsby-link` from your `package.json`

You no longer need the `gatsby-link` package. Everything that used to be there now lives in the main `gatsby` dependency.
We will adjust our imports later to reflect this change.

## Update your dependencies

Change the versions off all dependencies that contain `gatsby` in their name to `next`. You don't have to install them via the terminal just yet, just update the versions in `package.json`.

For this site that meant my `package.json` now looked like this:

```json
"dependencies": {
    "gatsby": "next",
    "gatsby-image": "next",
    "gatsby-plugin-catch-links": "next",
    "gatsby-plugin-google-analytics": "next",
    "gatsby-plugin-manifest": "next",
    "gatsby-plugin-netlify": "next",
    "gatsby-plugin-offline": "next",
    "gatsby-plugin-react-helmet": "next",
    "gatsby-plugin-sharp": "next",
    "gatsby-plugin-sitemap": "next",
    "gatsby-plugin-styled-components": "next",
    "gatsby-plugin-typography": "next",
    "gatsby-remark-copy-linked-files": "next",
    "gatsby-remark-images": "next",
    "gatsby-remark-prismjs": "next",
    "gatsby-source-filesystem": "next",
    "gatsby-transformer-remark": "next",
    "gatsby-transformer-sharp": "next",
  }
```

at this point I also deleted my `node-modules` folder and my lockfile `package-lock.json` (or `yarn.lock`).

## Install React

In v1 `react` and `react-dom` were included in the main `gatsby` dependency. This is no longer the case.

```bash
npm i react react-dom
```

## Install peer dependencies for your Gatsby plugins

Many packages depend on other packages to function correctly.
Make sure those dependencies are there.
If you don't know which packages you should install, go to the [Gatsby plugin browser](https://next.gatsbyjs.org/plugins/) and look at the line of code that tells you how to install the plugin. They have a line for each package in their plugin brower that looks like this:

```bash
npm install --save gatsby-plugin-something optional-peer-dependency another-optional-dependency
```

Also if you forget to install the peer dependencies and run `npm install` it will warn you in the console about unmet peer dependencies.

for me that meant:

```bash
npm i react helmet styled-components babel-plugin-styled-components react-typography typography
```

## Update (and move) the layout file.

`children()` now is no longer a function that has to be called, so remove those parentheses! Use `children` instead.
The official docs also recommend moving the file into the components directory. My components directory already had a folder for every component, so I moved the existing file at `src/layouts/index.js` into it's own folder too.
It now lives at `src/components/Layout/Layout.js` along with the accompanying `.css` file it had.
Don't forget to update all places you import these files!
The imports you use in the `Layout.js` file also have a high chace of needing edits.
I could now delete the old layouts folder (since it is empty).

```diff
- import theme from "../utils/theme";
+ import theme from "../../utils/theme";

- import Header from "../components/Header/Header";
+ import Header from "../Header/Header";
- import Footer from "../components/Footer/Footer";
+ import Footer from "../Footer/Footer";
```

## Wrap all pages in that component

Ensure all pages get wrapped by that component.
the `404.js` file in the `src/pages` directory now looks like this

```diff
import React from 'react';
+ import Layout from '../components/Layout/Layout'

const NotFoundPage = () => (
-  <div>
+  <Layout>
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
+  </Layout>
-  </div>
);

export default NotFoundPage;
```

Don't forget to also do this in your `src/templates/` files if you use [templates](https://www.gatsbyjs.org/tutorial/part-seven/#creating-pages)!

## Replace gatsby-link imports

Remember when we deleted `gatsby-link` from our `package.json`?
Lets update all instances where we used `gatsby-link` to use `gatsby` instead.

```diff
- import Link from 'gatsby-link'
+ import { Link } from 'gatsby'
```

## Add graphql imports

In v1 you could export queries that used `graphql` without first importing it 😕. Gatsby would know what you meant, and everything would work. The Gatsby docs explain [how it works](https://www.gatsbyjs.org/tutorial/part-four/#wait--where-did-the-graphql-tag-come-from). _or worked, since `graphql` is no longer there in v2 without first importing it._

You should no longer export a graphql query without first importing `graphql` in v2.

```diff
+ import { graphql } from "gatsby";
```

Adding this allowed me to remove the

```diff
- // eslint-disable-next-line
```

I talked about in my [automagically-lint](/blog/automagically-lint) blogpost

## Rename boundActionCreators to actions

Rename `boundActionCreators` to `actions`, you will probably find this in your `gatsby-node.js` file.

## Rename image queries

The image queries `sizes` and `resolutions` were renamed to `fluid` and `fixed` respectively.

That means I updated a few of my `graphql` queries:

```diff
frontmatter {
    cover {
      childImageSharp {
-     sizes {
+     fluid {
-        ...GatsbyImageSharpSizes_withWebp
+        ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
```

But don't remove `sizes` at the lowest level of your query!

```json{11}
frontmatter {
    cover {
        childImageSharp {
            fluid {
                base64
                aspectRatio
                src
                srcSet
                srcWebp
                srcSetWebp
                sizes
            }
        }
    }
}
```

## Use the same method importing/exporting

A single file should use only ES6 modules (`import` syntax) or only CommonJS (`require` syntax), not a mix of both.

The only place I had to change any code was in my `Layout.js` file, where I required some fonts.

```diff
- require('typeface-roboto');
+ import 'typeface-roboto';
- require('typeface-roboto-slab');
+ import 'typeface-roboto-slab';
```

## Make remaining necessary changes

I hit a snag because this site uses `typography`.
`scale` and `rhythm` weren't explicity exported.

```diff
const typography = new Typography(oceanBeachTheme);
+ const { rhythm, scale } = typography;

- export default typography
+ export { rhythm, scale, typography as default };
```

edit: Made a [PR](https://github.com/gatsbyjs/gatsby/pull/6151) that adds this info to the [official migration guide](https://next.gatsbyjs.org/docs/migrating-from-v1-to-v2/)
and it got accepted 🎉🎉🎉!

This post didn't mention lots of other changes that this site didn't need, but are covered in the official documentation, please [go check it out](https://next.gatsbyjs.org/docs/migrating-from-v1-to-v2/)!

## Turn it on

1.  delete the `.cache` and `public` directories
2.  install all your dependencies: `npm i` or `yarn` depending on your preference.
3.  run `gatsby develop`
4.  cross your fingers
5.  celebrate 🎉🎉🎉

Congratulations, your blazingly fast website is now even faster than before! 🔥🔥🔥
You can also use a bunch of [great new features](https://www.gatsbyjs.org/blog/2018-06-16-announcing-gatsby-v2-beta-launch/).
