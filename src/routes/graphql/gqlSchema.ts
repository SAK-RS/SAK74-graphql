import { GraphQLSchema } from 'graphql';
import { query } from './queries.js';

export const schema = new GraphQLSchema({
  query,
});
