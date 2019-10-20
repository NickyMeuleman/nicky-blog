import { ApolloServer } from 'apollo-server-lambda';
import resolvers from '../backend/resolvers';
import faunaContext from '../backend/db';
import typeDefs from '../backend/schema';

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
