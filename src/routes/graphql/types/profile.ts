import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { member, memberTypeId } from './member.js';
import type { CtxType } from '../schemas.js';
import DataLoader from 'dataloader';

export const profile = new GraphQLObjectType<any, CtxType>({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(member),
      resolve(source, _, { prisma, loaders }, { fieldNodes }) {
        let dl = loaders.get(fieldNodes);
        if (!dl) {
          dl = new DataLoader(async (keys) => {
            const members = await prisma.memberType.findMany({
              where: { id: { in: [...keys] } },
            });
            return keys.map((key) => members.find((member) => member.id === key));
          });
          loaders.set(fieldNodes, dl);
        }
        return dl.load(source.memberTypeId);
      },
    },
  },
});

export const createProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },

    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: UUIDType },
    memberTypeId: { type: new GraphQLNonNull(memberTypeId) },
  },
});

export const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeId },
  },
});
