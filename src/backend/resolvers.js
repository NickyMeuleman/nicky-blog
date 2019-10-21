const resolvers = {
  Query: {
    hello: (root, args, context) => `Hello, world!`,
    allBlogPosts: (root, args, { client, q }) => {
      console.log('ALLOFTHEM');
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
      console.log('BYSLUG');
      return client
        .query(q.Get(q.Match(q.Index('unique_BlogPost_slug'), args.slug)))
        .then(res => res.data);
    },
  },
  Mutation: {
    updateBlogPost: (root, args, { client, q }) => {
      console.log('UPDEET');
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
      console.log('CREAAAT');
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
      console.log('DELET');
    },
    addClaps: (root, args, { client, q }) => {
      console.log('ADD CLAPS');
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
