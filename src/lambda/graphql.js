// Function invocation failed: Error: Cannot find module 'core-js/features/array/flat'
import 'core-js';
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
  playground: true,
  introspection: true,
});

const handler = server.createHandler();

/* eslint-disable import/prefer-default-export */
export { handler };
