import { Module } from '@nestjs/common';

import { ShareDealQueryRepositoryAdapter } from '../share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { ShareDealQueryRepositoryPort } from '../share-deal/application/port/out/ShareDealQueryRepositoryPort';
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
    {
      provide: ShareDealQueryRepositoryPort,
      useClass: ShareDealQueryRepositoryAdapter,
    },
  ],
})
export class ChatModule {}
