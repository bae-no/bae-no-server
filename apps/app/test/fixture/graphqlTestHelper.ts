import { BaseExceptionFilter } from '@app/custom/nest/filter/BaseExceptionFilter';
import { EffectInterceptor } from '@app/custom/nest/interceptor/EffectInterceptor';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ModuleMetadata,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { CategoryQueryResolver } from '../../src/module/category/adapter/in/gql/CategoryQueryResolver';
import { Session } from '../../src/module/user/adapter/in/gql/auth/Session';
import { UserId } from '../../src/module/user/domain/User';

let userId: UserId | undefined;

export function setMockUser(id = UserId('userId')) {
  userId = id;
}

export function clearMockUser() {
  userId = undefined;
}

export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (userId) {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      request.user = new Session(UserId(userId));
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
        subscriptions: {
          'graphql-ws': true,
          'subscriptions-transport-ws': false,
        },
      }),
      ...(metadata.imports || []),
    ],
    providers: [CategoryQueryResolver, ...(metadata.providers || [])],
  }).compile();

  return module
    .createNestApplication()
    .useGlobalGuards(new MockGuard())
    .useGlobalFilters(new BaseExceptionFilter())
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .useGlobalInterceptors(new EffectInterceptor())
    .init();
}
