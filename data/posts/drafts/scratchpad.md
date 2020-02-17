---
published: false
---

TODO:

## Serverless GraphQL using multiple files

## Using FaunaDB as serverless database

```bash
CreateIndex({
  name: "pokemonSortById",
  source: Collection("Pokemon"),
  values: [
    { field: ["data", "id"] },
    { field: ["ref"] }
  ]
})
```

2 objects in the values array, so 2 variables to use in Lambda

```js
    allPokemon: (obj, args, { client, query: q }) => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index("pokemonSortById")), { size: 256 }),
            q.Lambda(["id", "ref"], q.Get(q.Var("ref")))
          )
        )
        .then(result => {
          return result.data.map(item => item.data);
        });
    },
```

https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55

plug Chris Biscardi FaunaDB Egghead course
a little ~~birdie~~ corgi told me more content is coming!

chrisbiscardiToday at 12:02 AM
I ran a yarn cache clean the other day that took like 5-10 minutes to complete @talves
@JacobBolda fauna is a globally distributed document store that supports GraphQL as first class and because it's in the "spanner/calvin" class of databases, you get joins and such on the documents in a strongly consistent way
https://egghead.io/lessons/faunadb-an-introduction-to-faunadb?pl=the-complete-guide-to-faunadb-74bef44b has the overview

https://github.com/ChristopherBiscardi/christopherbiscardi.github.com/blob/gatsby-2/www/content/dev-tips/faunadb.yaml

## faunadb claps

```
CreateIndex({
  name: "blogPostSlugAndLikes",
  source: Collection("BlogPost"),
  values: [
    { field: ["data", "slug"] },
    { field: ["data", "likes"] }
  ]
})
```

const nodeExternals = require('webpack-node-externals');

module.exports = {
externals: [nodeExternals()],
};

Our Pokémon-themed serverless GraphQL endpoint is ready to use a database. 🕐 Time to add a lot of them to FaunaDB!
