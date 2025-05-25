import { GraphQLObjectType, GraphQLString } from 'graphql';
import { memberTypeSchema } from '../member-types/schemas.js';
import { CtxType } from './schemas.js';

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: GraphQLString,
      resolve: (_, __, ctx: CtxType) => ctx.prisma.memberType.findMany(),
    },
  },
});
