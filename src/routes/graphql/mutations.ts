import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { changeUserInput, user, userInput } from './types/user.js';
import type { CtxType } from './schemas.js';
import { changeProfileInput, createProfileInput, profile } from './types/profile.js';
import { changePostInput, createPostInput, post } from './types/post.js';
import { UUIDType } from './types/uuid.js';

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

    createProfile: {
      type: new GraphQLNonNull(profile),
      args: { dto: { type: new GraphQLNonNull(createProfileInput) } },
      resolve: (_, args, { prisma }) => prisma.profile.create({ data: args.dto }),
    },

    createPost: {
      type: new GraphQLNonNull(post),
      args: { dto: { type: new GraphQLNonNull(createPostInput) } },
      resolve: (_, args, { prisma }) => prisma.post.create({ data: args.dto }),
    },

    changePost: {
      type: new GraphQLNonNull(post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changePostInput) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.post.update({ where: { id: args.id }, data: args.dto }),
    },

    changeProfile: {
      type: new GraphQLNonNull(profile),
      args: {
        id: { type: UUIDType },
        dto: { type: new GraphQLNonNull(changeProfileInput) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
          include: { memberType: true },
        }),
    },

    changeUser: {
      type: new GraphQLNonNull(user),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserInput) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.user.update({ where: { id: args.id }, data: args.dto }),
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.user.delete({ where: { id: args.id } }).then(() => args.id),
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.post.delete({ where: { id: args.id } }).then(() => args.id),
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.profile.delete({ where: { id: args.id } }).then(() => args.id),
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.user
          .update({
            where: { id: args.userId },
            data: {
              userSubscribedTo: {
                create: {
                  author: { connect: { id: args.authorId } },
                },
              },
            },
          })
          .then(() => args.userId),
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: (_, args, { prisma }) =>
        prisma.user
          .update({
            where: { id: args.userId },
            data: {
              userSubscribedTo: {
                delete: {
                  subscriberId_authorId: {
                    authorId: args.authorId,
                    subscriberId: args.userId,
                  },
                },
              },
            },
          })
          .then(() => args.userId),
    },
  },
});
