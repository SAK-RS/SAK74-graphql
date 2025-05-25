import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { CtxType } from '../schemas.js';
import { profile } from './profile.js';
import { post } from './post.js';

export const user = new GraphQLObjectType<any, CtxType>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profile,
      resolve: (source, _, { prisma }) =>
        prisma.profile.findUnique({ where: { userId: source.id } }),
    },
    posts: {
      type: new GraphQLList(post),
      resolve: (source, _, { prisma }) =>
        prisma.post.findMany({ where: { authorId: source.id } }),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(user)),
      resolve: (source, _, { prisma }) =>
        prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: source.id } } },
        }),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(user)),
      resolve: (source, _, { prisma }) =>
        prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: source.id } } },
        }),
    },
  }),
});

export const userInput = new GraphQLInputObjectType({
  name: 'User DTO',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
