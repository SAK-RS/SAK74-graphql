import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { CtxType } from './schemas.js';
import { member, memberTypeId } from './types/member.js';
import { profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { user } from './types/user.js';
import { post } from './types/post.js';

export const query = new GraphQLObjectType<any, CtxType>({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(member),
      resolve: (_, __, ctx) => ctx.prisma.memberType.findMany(),
    },
    memberType: {
      type: member,
      args: {
        id: { type: new GraphQLNonNull(memberTypeId) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.memberType.findUnique({ where: { id: args.id } }),
    },
    profiles: {
      type: new GraphQLList(profile),
      resolve(_, __, { prisma }) {
        return prisma.profile.findMany();
      },
    },
    profile: {
      type: profile,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, args, { prisma }) =>
        prisma.profile.findUnique({ where: { id: args.id } }),
    },
    users: {
      type: new GraphQLList(user),
      resolve: (_, __, { prisma }) => prisma.user.findMany(),
    },
    user: {
      type: user,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, args, { prisma }) =>
        prisma.user.findUnique({ where: { id: args.id } }),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(post)),
      resolve: (_, __, { prisma }) => prisma.post.findMany(),
    },
    post: {
      type: post,
      args: {
        id: { type: UUIDType },
      },
      resolve: (_, args, { prisma }) =>
        prisma.post.findUnique({ where: { id: args.id } }),
    },
  },
});
