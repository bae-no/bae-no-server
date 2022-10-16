import { Module } from '@nestjs/common';

import { ShareDealQueryRepositoryAdapter } from '../share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { ShareDealQueryRepositoryPort } from '../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ChatMutationResolver } from './adapter/in/gql/ChatMutationResolver';
import { ChatSubscriptionResolver } from './adapter/in/gql/ChatSubscriptionResolver';
import { ChatEventListener } from './adapter/in/listener/ChatEventListener';
import { ChatRepositoryAdapter } from './adapter/out/persistence/ChatRepositoryAdapter';
import { ChatCommandUseCase } from './application/port/in/ChatCommandUseCase';
import { ChatQueryUseCase } from './application/port/in/ChatQueryUseCase';
import { ChatRepositoryPort } from './application/port/out/ChatRepositoryPort';
import { ChatCommandService } from './application/service/ChatCommandService';
import { ChatQueryService } from './application/service/ChatQueryService';

@Module({
  providers: [
    ChatMutationResolver,
    ChatSubscriptionResolver,
    ChatEventListener,
    {
      provide: ChatQueryUseCase,
      useClass: ChatQueryService,
    },
    {
      provide: ChatCommandUseCase,
      useClass: ChatCommandService,
    },
    {
      provide: ShareDealQueryRepositoryPort,
      useClass: ShareDealQueryRepositoryAdapter,
    },
    {
      provide: ChatRepositoryPort,
      useClass: ChatRepositoryAdapter,
    },
  ],
})
export class ChatModule {}
