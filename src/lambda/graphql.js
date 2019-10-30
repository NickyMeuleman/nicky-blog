import { ApolloServer } from 'apollo-server-lambda';
import resolvers from './utils/resolvers';
import faunaContext from './utils/db';
import typeDefs from './utils/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    client: faunaContext.client,
    q: faunaContext.q,
  }),
  playground: process.env.NODE_ENV !== 'production',
  introspection: process.env.NODE_ENV !== 'production',
  cors: {
    origin: [
      'http://localhost',
      'https://nickymeuleman.netlify.com',
      'http://nickymeuleman.netlify.com',
    ],
    credentials: true,
  },
});

const handler = server.createHandler();

/* eslint-disable import/prefer-default-export */
export { handler };
