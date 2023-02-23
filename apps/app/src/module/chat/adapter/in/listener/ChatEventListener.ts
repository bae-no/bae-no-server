import { T, pipe } from '@app/custom/effect';
import { TE } from '@app/custom/fp-ts';
import { Service } from '@app/custom/nest/decorator/Service';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { OnEvent } from '@nestjs/event-emitter';

import { ChatWrittenTrigger } from './ChatWritttenTrigger';
import { ShareDealQueryRepositoryPort } from '../../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealClosedEvent } from '../../../../share-deal/domain/event/ShareDealClosedEvent';
import { ShareDealEndedEvent } from '../../../../share-deal/domain/event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from '../../../../share-deal/domain/event/ShareDealStartedEvent';
import type { ShareDeal } from '../../../../share-deal/domain/ShareDeal';
import { ChatRepositoryPort } from '../../../application/port/out/ChatRepositoryPort';
import { Chat } from '../../../domain/Chat';
import { ChatReadEvent } from '../../../domain/event/ChatReadEvent';
import { ChatWrittenEvent } from '../../../domain/event/ChatWrittenEvent';
import { ChatWrittenResponse } from '../gql/response/ChatWrittenResponse';

@Service()
export class ChatEventListener {
  constructor(
    private readonly pubSubPort: PubSubPort,
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
    private readonly ticketGeneratorPort: TicketGeneratorPort,
  ) {}

  @OnEvent(ChatReadEvent.name, { async: true })
  async handleChatReadEvent(event: ChatReadEvent) {
    await pipe(
      this.chatRepositoryPort.updateRead(event.shareDealId, event.userId),
      T.runPromise,
    );
  }

  @OnEvent(ChatWrittenEvent.name, { async: true })
  handleChatWrittenEvent(event: ChatWrittenEvent) {
    if (Array.isArray(event.chats) && event.chats.length === 0) {
      return;
    }

    this.pubSubPort.publish(
      ChatWrittenTrigger(event.chats[0].shareDealId),
      ChatWrittenResponse.of(event.chats[0].message),
    );
  }

  @OnEvent(
    [
      ShareDealStartedEvent.name,
      ShareDealEndedEvent.name,
      ShareDealClosedEvent.name,
    ],
    { async: true },
  )
  async handleShareDealUpdatedEvent(
    event: ShareDealStartedEvent | ShareDealEndedEvent | ShareDealClosedEvent,
  ) {
    await pipe(
      this.shareDealQueryRepositoryPort.findById(event.shareDealId),
      TE.map((shareDeal) => this.createChats(shareDeal, event)),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) =>
        this.eventEmitterPort.emit(new ChatWrittenEvent(chats)),
      ),
    )();
  }

  private createChats(
    shareDeal: ShareDeal,
    event: ShareDealStartedEvent | ShareDealEndedEvent | ShareDealClosedEvent,
  ): Chat[] {
    if (event instanceof ShareDealStartedEvent) {
      return Chat.createByStartShareDeal(
        shareDeal.id,
        shareDeal.participantInfo.ids,
        shareDeal.ownerId,
        this.ticketGeneratorPort.generateId(),
      );
    }

    if (event instanceof ShareDealClosedEvent) {
      return Chat.createByCloseShareDeal(
        shareDeal.id,
        shareDeal.participantInfo.ids,
        shareDeal.ownerId,
        this.ticketGeneratorPort.generateId(),
      );
    }

    return Chat.createByEndShareDeal(
      shareDeal.id,
      shareDeal.participantInfo.ids,
      shareDeal.ownerId,
      this.ticketGeneratorPort.generateId(),
    );
  }
}
