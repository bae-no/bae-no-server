import { Module } from '@nestjs/common';

import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';
import { UserCommandUseCase } from './application/port/in/UserCommandUseCase';
import { UserCommandService } from './application/service/UserCommandService';

@Module({
  providers: [
    UserMutationResolver,
    {
      provide: UserCommandUseCase,
      useClass: UserCommandService,
    },
  ],
})
export class UserModule {}
