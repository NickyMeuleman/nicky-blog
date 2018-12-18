---
title: JSON-schemas are awesome
date: "2018-12-17"
author: "Nicky Meuleman"
cover: "./cover.jpeg"
tags: ["Lint", "Howto", "DX"]
---

## _**Configuration files**_

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

You can define the exact schema you want to use in your editor's workspace settings.
When I wrote this, I knew you _could_, but not _how_.
Luckily for me the autocomplete powered by, you guessed it, a JSON-schema, told me exactly what it expected.

```json
// in VSCode workspace settings .json file (ctrl/cmd+shift+p to search for it)
{
  "json.schemas": [
    {
      "fileMatch": ["/.babelrc"],
      "url": "http://json.schemastore.org/babelrc"
    }
  ]
}
```

## Your own schema

A schema doesn't need to be remote. You can link you file of choice to a (local) schema you wrote yourself.

In this `json` file, we point to the schema used to validate against.

```json
// drivers.json
{
  "$schema": "./drivers.schema.json"
}
```

The file `$schema` points to is in the same directory

```json
// drivers.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema"
}
```

The value for `$schema` defines which version of the JSON-schema spec is being used.

An empty file is boring, the code beneath adds a few contraints to our `driver.json`

```json
// drivers.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Drivers",
  "description": "Formula 1 drivers",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "series": {
      "type": "string"
    },
    "season": {
      "type": "integer"
    }
  }
}
```

- Title and description are meant to describe the file that follows this schema.
- The entire file should be of the type `object` (which isn't a problem, since it's `json`)
- Only the (top-level) properties/keys we declare are accepted.
- Each one of those properties should be of a specified type.

Here I tried to specify the season as `"2018"`

![incorrect type error](expected-integer.png)

Now for a taste of something more complex.

```json
// drivers.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Drivers",
  "description": "Formula 1 drivers",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "series": {
      "type": "string"
    },
    "season": {
      "type": "integer"
    },
    "driverList": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/driver"
      }
    }
  },
  "definitions": {
    "driver": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "raceNumber": {
          "type": "integer",
          "minimum": 0,
          "maximum": 99
        },
        "code": {
          "type": "string",
          "minLength": 3,
          "maxLength": 3
        },
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "dateOfBirth": {
          "type": "string",
          "format": "date",
          "description": "dateOfBirth in YYYY-MM-DD format",
          "default": "YYYY-MM-DD"
        },
        "nationality": {
          "type": "string"
        },
        "team": {
          "$ref": "#/definitions/team"
        },
        "quotes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "uniqueItems": true
        }
      },
      "required": ["raceNumber", "code", "team"]
    },
    "team": {
      "enum": [
        "MCLAREN",
        "FERRARI",
        "REDBULL",
        "TOROROSSO",
        "MERCEDES",
        "RENAULT",
        "HAAS",
        "FORCEINDIA",
        "SAUBER",
        "WILLIAMS"
      ]
    }
  }
}
```

This is an example that would satisfy the schema

```json
// drivers.json
{
  "$schema": "./drivers.schema.json",
  "series": "f1",
  "season": 2018,
  "driverList": [
    {
      "raceNumber": 14,
      "code": "ALO",
      "firstName": "Fernando",
      "lastName": "Alonso",
      "dateOfBirth": "1981-07-29",
      "team": "MCLAREN",
      "quotes": ["GP2 engine, GP2", "5 second penalty? Issa yoke"]
    },
    {
      "raceNumber": 3,
      "code": "RIC",
      "firstName": "Daniel",
      "lastName": "Ricciardo",
      "dateOfBirth": "1989-07-01",
      "nationality": "Australian",
      "team": "REDBULL"
    }
  ]
}
```

Work In Progress, more soon.
