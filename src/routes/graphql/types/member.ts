import { GraphQLEnumType, GraphQLFloat, GraphQLInt, GraphQLObjectType } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      description: 'Basic type',
      value: MemberTypeId.BASIC,
    },
    business: {
      description: 'Business type',
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const member = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: memberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});
