import { Module } from '@nestjs/common';

import { ShareDealQueryRepositoryAdapter } from '../share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { ShareDealQueryUseCase } from '../share-deal/application/port/in/ShareDealQueryUseCase';
import { ShareDealQueryRepositoryPort } from '../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealQueryService } from '../share-deal/application/service/ShareDealQueryService';
import { ChatMutationResolver } from './adapter/in/gql/ChatMutationResolver';
import { ChatSubscriptionResolver } from './adapter/in/gql/ChatSubscriptionResolver';
import { ChatEventListener } from './adapter/in/listener/ChatEventListener';
import { ChatRepositoryAdapter } from './adapter/out/persistence/ChatRepositoryAdapter';
import { ChatCommandUseCase } from './application/port/in/ChatCommandUseCase';
import { ChatRepositoryPort } from './application/port/out/ChatRepositoryPort';
import { ChatCommandService } from './application/service/ChatCommandService';

@Module({
  providers: [
    ChatMutationResolver,
    ChatSubscriptionResolver,
    ChatEventListener,
    {
      provide: ShareDealQueryUseCase,
      useClass: ShareDealQueryService,
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
