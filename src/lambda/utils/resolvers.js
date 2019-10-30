const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return `Hello, world!`;
    },
    allBlogPosts: (root, args, { client, q }) => {
      return client
        .query(
          q.Map(
            q.Paginate(q.Match(q.Index('allBlogPosts'))),
            q.Lambda('ref', q.Get(q.Var('ref')))
          )
        )
        .then(res => res.data.map(item => item.data));
    },
    blogPostBySlug: (root, args, { client, q }) => {
      return client
        .query(q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug)))
        .then(res => res.data);
    },
    blogPostsBySlug: (root, args, { client, q }) => {
      // TODO: optimize queries. Gather references first, do a single Get? less X-ops?
      return client
        .query(
          q.Map(
            args.slugs,
            q.Lambda(
              'slug',
              q.Get(q.Match(q.Index('unique_BlogPost_slug'), q.Var('slug')))
            )
          )
        )
        .then(res => res.map(item => item.data));
    },
  },
  Mutation: {
    updateBlogPost: (root, args, { client, q }) => {
      return client
        .query(
          q.Update(
            q.Select(
              ['ref'],
              q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug))
            ),
            { data: args.updates }
          )
        )
        .then(res => res.data);
    },
    createBlogPost: (root, args, { client, q }) => {
      // unique constraint in FaunaDB on slug prevents duplicates
      return client
        .query(
          q.Create(q.Collection('BlogPost'), {
            data: {
              slug: args.slug,
              likes: 0,
            },
          })
        )
        .then(res => res.data);
    },
    deleteBlogPost: (root, args, { client, q }) => {
      return client.query(
        q.Delete(
          q.Select(
            'ref',
            q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug))
          )
        )
      );
    },
    addClaps: (root, args, { client, q }) => {
      // TODO: Improve query, find way to use Index with slug and likes
      return client.query(
        q.Update(
          q.Select(
            'ref',
            q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug))
          ),
          {
            data: {
              likes: q.Add(
                args.increment,
                q.Select(
                  ['data', 'likes'],
                  q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug))
                )
              ),
            },
          }
        )
      );
    },
  },
};

export default resolvers;
