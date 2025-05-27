import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      description: 'Basic type',
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      description: 'Business type',
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const member = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: memberTypeId },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});
