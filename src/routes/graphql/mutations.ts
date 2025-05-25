import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { user, userInput } from './types/user.js';
import { CtxType } from './schemas.js';

export const mutation = new GraphQLObjectType<any, CtxType>({
  name: 'Mutation',
  fields: {
    createUser: {
      type: user,
      args: {
        dto: { type: new GraphQLNonNull(userInput) },
      },
      resolve: (_, args, { prisma }) => prisma.user.create({ data: args.dto }),
    },
  },
});
