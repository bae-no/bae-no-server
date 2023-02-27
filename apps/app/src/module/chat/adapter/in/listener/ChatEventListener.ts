import { T, pipe, O, NEA } from '@app/custom/effect';
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
    pipe(
      NEA.fromArray(event.chats),
      O.map(NEA.head),
      O.map((chat) =>
        this.pubSubPort.publish(
          ChatWrittenTrigger(chat.shareDealId),
          ChatWrittenResponse.of(chat.message),
        ),
      ),
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
      this.shareDealQueryRepositoryPort.findByIdE(event.shareDealId),
      T.map((shareDeal) => this.createChats(shareDeal, event)),
      T.chain((chats) => this.chatRepositoryPort.create(chats)),
      T.map((chats) => this.eventEmitterPort.emit(new ChatWrittenEvent(chats))),
      T.runPromise,
    );
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
