import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { CtxType } from './schemas.js';
import { member, memberTypeId } from './types/member.js';
import { profile } from './types/profile.js';
import { UUIDType } from './types/uuid.js';
import { user } from './types/user.js';
import { post } from './types/post.js';
import { parseResolveInfo, ResolveTree, simplify } from 'graphql-parse-resolve-info';

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
      resolve: async (_, __, { prisma, loaders }, info) => {
        const parseInfo = parseResolveInfo(info);

        const { fields } = simplify(parseInfo as ResolveTree, info.returnType);
        const keys = Object.keys(fields);

        const users = await prisma.user.findMany({
          include: {
            subscribedToUser: keys.includes('subscribedToUser'),
            userSubscribedTo: keys.includes('userSubscribedTo'),
          },
        });

        users.forEach((user) => {
          if (keys.includes('subscribedToUser')) {
            const subscribers = users.filter((subscriber) =>
              subscriber.userSubscribedTo?.some((sbs) => sbs.authorId === user.id),
            );
            loaders.subscribedToUserLoader.prime(user.id, subscribers);
          }
          if (keys.includes('userSubscribedTo')) {
            const authors = users.filter((author) => {
              return author.subscribedToUser?.some((sbs) => sbs.subscriberId === user.id);
            });
            loaders.userSubscribedToLoader.prime(user.id, authors);
          }
        });

        return users;
      },
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
