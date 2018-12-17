---
title: JSON-schemas are awesome
date: "2018-12-17"
author: "Nicky Meuleman"
cover: "./cover.jpeg"
tags: ["Lint", "Howto", "DX"]
---

### _**Configuration files**_

Did those words make you feel (a bit of) dread?

You are not alone, writing a configuration object/file is pretty low on most developers list of favorite passtimes.

When writing these files (for example a `.eslintrc.json`) spelling is one of your worst enemies.
Was it `no-unused-vars`, `noUnusedVars`, `no-unused-var` or something else?

**Many hours of devtime have been lost to spelling**

Remembering what that specific option expects to receive is another one of those enemies.

_Does this expect an array or an object, I don't remember 😰_

One will work, the other grants a one way ticket to crypticError town.

For those reasons (and more) having the docs open while you write your configuration is an absolute _must_

## There is a better way

The solution? Laziness

I'm half kidding, the solution is the title of this blog-post, JSON-schemas.

Leveraging one of those means you can lean on intelligent auto-complete and error-detection to do the heavy lifting for you!

To get started with the least amount of effort, you can use VSCode, which has builtin support for JSON-schema. Start a file that is listed at [schemastore.org](http://schemastore.org/json/) and trigger the autocomplete in the editor (ctrl/cmd + space)

![empty .babelrc file](./empty-babelrc.png)

Hitting `tab` on an option in that list and automatically getting empty straight brackets if that key expects an array as value is **so helpful**.
Play around with your configuration file of choice, if the schema supports it, the amount of nesting doesn't matter, your editor will know what can fit there.

## Your own schema

Want to define your own schema?

Work In Progress, more soon.
