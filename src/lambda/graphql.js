import { ApolloServer } from 'apollo-server-lambda';
import resolvers from './utils/resolvers';
import faunaContext from './utils/db';
import typeDefs from './utils/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({
    client: faunaContext.client,
    q: faunaContext.q,
    headers: event.headers,
  }),
  // netlify dev returns 'production' for process.env.NODE_ENV
  // https://github.com/netlify/cli/issues/473
  // playground: process.env.NODE_ENV !== 'production',
  // introspection: process.env.NODE_ENV !== 'production',
});

const handler = server.createHandler({
  cors: {
    origin: [
      'https://nickymeuleman.netlify.com',
      'http://nickymeuleman.netlify.com',
      'http://localhost',
    ],
    credentials: true,
  },
});

export { handler };
