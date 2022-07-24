import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication, Provider } from '@nestjs/common';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

@Resolver()
export class TestQueryResolver {
  @Query(() => String)
  foo(): string {
    return 'bar';
  }
}

export async function graphQLTestHelper(
  providers: Provider[],
): Promise<INestApplication> {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: true,
      }),
    ],
    providers: [TestQueryResolver, ...providers],
  }).compile();

  return module.createNestApplication().init();
}
