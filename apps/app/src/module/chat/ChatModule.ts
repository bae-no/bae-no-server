import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { TicketGeneratorAdapter } from '@app/ticket-generator/TicketGeneratorAdapter';
import { Module } from '@nestjs/common';

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
import { ShareDealModule } from '../share-deal/ShareDealModule';
import { UserModule } from '../user/UserModule';

@Module({
  imports: [ShareDealModule, UserModule],
  providers: [
    ChatQueryResolver,
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
      provide: ChatQueryRepositoryPort,
      useClass: ChatQueryRepositoryAdapter,
    },
    {
      provide: ChatRepositoryPort,
      useClass: ChatRepositoryAdapter,
    },
    {
      provide: TicketGeneratorPort,
      useClass: TicketGeneratorAdapter,
    },
  ],
})
export class ChatModule {}
