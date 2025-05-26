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
import DataLoader from 'dataloader';

export const user = new GraphQLObjectType<any, CtxType>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profile,
      resolve: (source, _, { prisma, loaders }, { fieldNodes }) => {
        let dl = loaders.get(fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (keys) => {
            const profiles = await prisma.profile.findMany({
              where: { userId: { in: [...keys] } },
            });
            return keys.map((key) => profiles.find((profile) => profile.userId === key));
          });

          loaders.set(fieldNodes, dl);
        }
        return dl.load(source.id);
      },
    },
    posts: {
      type: new GraphQLList(post),
      resolve: (source, _, { prisma, loaders }, info) => {
        let dl = loaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (keys) => {
            const posts = await prisma.post.findMany({
              where: { authorId: { in: [...keys] } },
            });
            return keys.map((key) => posts.filter((post) => post.authorId === key));
          });
          loaders.set(info.fieldNodes, dl);
        }
        return dl.load(source.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(user)),
      resolve: (source, _, { prisma, loaders }, info) => {
        let dl = loaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (keys) => {
            const authors = await prisma.user.findMany({
              include: { subscribedToUser: true },
              where: { subscribedToUser: { some: { subscriberId: { in: [...keys] } } } },
            });
            return keys.map((key) =>
              authors.filter((author) =>
                author.subscribedToUser.some((user) => user.subscriberId === key),
              ),
            );
          });

          loaders.set(info.fieldNodes, dl);
        }
        return dl.load(source.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(user)),
      resolve: (source, _, { prisma, loaders }, info) => {
        let dl = loaders.get(info.fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (keys) => {
            const subscribers = await prisma.user.findMany({
              include: { userSubscribedTo: true },
              where: { userSubscribedTo: { some: { authorId: { in: [...keys] } } } },
            });
            return keys.map((key) =>
              subscribers.filter((sbs) =>
                sbs.userSubscribedTo.some((user) => user.authorId === key),
              ),
            );
          });

          loaders.set(info.fieldNodes, dl);
        }
        return dl.load(source.id);
      },
    },
  }),
});

export const userInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
