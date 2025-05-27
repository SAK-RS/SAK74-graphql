import { Type } from '@fastify/type-provider-typebox';
import type { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import type { FieldNode } from 'graphql';
import { createLoaders } from './loaders.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export type CtxType = {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
};
