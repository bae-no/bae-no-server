import { O, RNEA, TE } from '@app/custom/fp-ts';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';

import { ShareDealQueryRepositoryPort } from '../../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealEndedEvent } from '../../../../share-deal/domain/event/ShareDealEndedEvent';
import { ShareDealStartedEvent } from '../../../../share-deal/domain/event/ShareDealStartedEvent';
import { ShareDeal } from '../../../../share-deal/domain/ShareDeal';
import { ChatRepositoryPort } from '../../../application/port/out/ChatRepositoryPort';
import { Chat } from '../../../domain/Chat';
import { ChatReadEvent } from '../../../domain/event/ChatReadEvent';
import { ChatWrittenEvent } from '../../../domain/event/ChatWrittenEvent';
import { ChatWrittenResponse } from '../gql/response/ChatWrittenResponse';
import { ChatWrittenTrigger } from './ChatWritttenTrigger';

@Injectable()
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
    await this.chatRepositoryPort.updateRead(event.shareDealId, event.userId)();
  }

  @OnEvent(ChatWrittenEvent.name, { async: true })
  handleChatWrittenEvent(event: ChatWrittenEvent) {
    pipe(
      RNEA.fromArray(event.chats),
      O.map(RNEA.head),
      O.map((chat) =>
        this.pubSubPort.publish(
          ChatWrittenTrigger(chat.shareDealId),
          ChatWrittenResponse.of(chat.message),
        ),
      ),
    );
  }

  @OnEvent([ShareDealStartedEvent.name, ShareDealEndedEvent.name], {
    async: true,
  })
  async handleShareDealUpdatedEvent(
    event: ShareDealStartedEvent | ShareDealEndedEvent,
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
    event: ShareDealStartedEvent | ShareDealEndedEvent,
  ): Chat[] {
    if (event instanceof ShareDealStartedEvent) {
      return Chat.createByStartShareDeal(
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
