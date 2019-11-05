import dotenv from 'dotenv';
import faunadb, { query } from 'faunadb';

dotenv.config();

function createClient() {
  if (!process.env.FAUNADB_SERVER_SECRET) {
    throw new Error(
      `No FAUNADB_SERVER_SECRET in environment, skipping context setup`
    );
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });

  return { client, q: query };
}

const faunaContext = createClient();

export default faunaContext;
