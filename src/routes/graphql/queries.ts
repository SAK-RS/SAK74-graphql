import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { CtxType } from './schemas.js';
import { member, memberTypeId } from './types/member.js';
import { MemberType } from '@prisma/client';
import { profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';

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
  },
});
