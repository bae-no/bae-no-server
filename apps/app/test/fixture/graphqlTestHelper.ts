import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoryQueryResolver } from '../../src/module/category/adapter/in/gql/CategoryQueryResolver';
import { Session } from '../../src/module/user/adapter/in/gql/auth/Session';

let userId: string | undefined;

export function setMockUser(id = 'userId') {
  userId = id;
}

export function clearMockUser() {
  userId = undefined;
}

@Injectable()
export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (userId) {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      request.user = new Session(userId);
    }

    return true;
  }
}

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

  return module
    .createNestApplication()
    .useGlobalGuards(new MockGuard())
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .init();
}
