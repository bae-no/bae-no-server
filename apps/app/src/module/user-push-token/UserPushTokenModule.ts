import { Module } from '@nestjs/common';

import { UserPushTokenMutationResolver } from './adapter/in/gql/UserPushTokenMutationResolver';
import { UserPushTokenEventListener } from './adapter/in/listener/UserPushTokenEventListener';
import { UserPushTokenQueryRepositoryAdapter } from './adapter/out/persistence/UserPushTokenQueryRepositoryAdapter';
import { UserPushTokenRepositoryAdapter } from './adapter/out/persistence/UserPushTokenRepositoryAdapter';
import { UserPushTokenCommandUseCase } from './application/port/in/UserPushTokenCommandUseCase';
import { UserPushTokenQueryRepositoryPort } from './application/port/out/UserPushTokenQueryRepositoryPort';
import { UserPushTokenRepositoryPort } from './application/port/out/UserPushTokenRepositoryPort';
import { UserPushTokenCommandService } from './application/service/UserPushTokenCommandService';

@Module({
  providers: [
    UserPushTokenMutationResolver,
    UserPushTokenEventListener,
    {
      provide: UserPushTokenCommandUseCase,
      useClass: UserPushTokenCommandService,
    },
    {
      provide: UserPushTokenQueryRepositoryPort,
      useClass: UserPushTokenQueryRepositoryAdapter,
    },
    {
      provide: UserPushTokenRepositoryPort,
      useClass: UserPushTokenRepositoryAdapter,
    },
  ],
})
export class UserPushTokenModule {}
