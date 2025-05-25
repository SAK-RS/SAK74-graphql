import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { member } from './member.js';
import { CtxType } from '../schemas.js';

export const profile = new GraphQLObjectType<any, CtxType>({
  name: 'Profile',
  fields: {
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(member),
      resolve(source, _, { prisma }) {
        return prisma.memberType.findUnique({ where: { id: source.memberTypeId } });
      },
    },
  },
});
