import { ApolloServer } from 'apollo-server-lambda';
import resolvers from './resolvers';
import faunaContext from './db';
import typeDefs from './schema';

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
