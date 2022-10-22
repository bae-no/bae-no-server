import { Module } from '@nestjs/common';

import { ShareDealQueryRepositoryAdapter } from '../share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { ShareDealQueryUseCase } from '../share-deal/application/port/in/ShareDealQueryUseCase';
import { ShareDealQueryRepositoryPort } from '../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealQueryService } from '../share-deal/application/service/ShareDealQueryService';
import { ChatMutationResolver } from './adapter/in/gql/ChatMutationResolver';
import { ChatQueryResolver } from './adapter/in/gql/ChatQueryResolver';
import { ChatSubscriptionResolver } from './adapter/in/gql/ChatSubscriptionResolver';
import { ChatEventListener } from './adapter/in/listener/ChatEventListener';
import { ChatQueryRepositoryAdapter } from './adapter/out/persistence/ChatQueryRepositoryAdapter';
import { ChatRepositoryAdapter } from './adapter/out/persistence/ChatRepositoryAdapter';
import { ChatCommandUseCase } from './application/port/in/ChatCommandUseCase';
import { ChatQueryUseCase } from './application/port/in/ChatQueryUseCase';
import { ChatQueryRepositoryPort } from './application/port/out/ChatQueryRepositoryPort';
import { ChatRepositoryPort } from './application/port/out/ChatRepositoryPort';
import { ChatCommandService } from './application/service/ChatCommandService';
import { ChatQueryService } from './application/service/ChatQueryService';

@Module({
  providers: [
    ChatQueryResolver,
    ChatMutationResolver,
    ChatSubscriptionResolver,
    ChatEventListener,
    {
      provide: ShareDealQueryUseCase,
      useClass: ShareDealQueryService,
    },
    {
      provide: ShareDealQueryRepositoryPort,
      useClass: ShareDealQueryRepositoryAdapter,
    },
    {
      provide: ChatQueryUseCase,
      useClass: ChatQueryService,
    },
    {
      provide: ChatCommandUseCase,
      useClass: ChatCommandService,
    },
    {
      provide: ChatQueryRepositoryPort,
      useClass: ChatQueryRepositoryAdapter,
    },
    {
      provide: ChatRepositoryPort,
      useClass: ChatRepositoryAdapter,
    },
  ],
})
export class ChatModule {}
