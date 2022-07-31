import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryQueryResolver } from '../../src/module/category/adapter/in/gql/CategoryQueryResolver';

export async function graphQLTestHelper(
  metadata: ModuleMetadata,
): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: true,
      }),
      ...(metadata.imports || []),
    ],
    providers: [CategoryQueryResolver, ...(metadata.providers || [])],
  }).compile();

  return module.createNestApplication().init();
}
