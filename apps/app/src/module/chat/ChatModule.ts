import { Module } from '@nestjs/common';

import { ChatMutationResolver } from './adapter/in/gql/ChatMutationResolver';
import { ChatCommandUseCase } from './application/port/in/ChatCommandUseCase';
import { ChatCommandService } from './application/service/ChatCommandService';

@Module({
  providers: [
    ChatMutationResolver,
    {
      provide: ChatCommandUseCase,
      useClass: ChatCommandService,
    },
  ],
})
export class ChatModule {}
