import { Module } from '@nestjs/common';

import { UserPushTokenListener } from './adapter/in/listener/UserPushTokenListener';
import { UserPushTokenQueryRepositoryAdapter } from './adapter/out/persistence/UserPushTokenQueryRepositoryAdapter';
import { UserPushTokenRepositoryAdapter } from './adapter/out/persistence/UserPushTokenRepositoryAdapter';
import { UserPushTokenQueryRepositoryPort } from './application/port/out/UserPushTokenQueryRepositoryPort';
import { UserPushTokenRepositoryPort } from './application/port/out/UserPushTokenRepositoryPort';

@Module({
  providers: [
    UserPushTokenListener,
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
