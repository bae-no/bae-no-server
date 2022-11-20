import { O, RNEA, TE } from '@app/custom/fp-ts';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';

import { ShareDealQueryRepositoryPort } from '../../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealStartedEvent } from '../../../../share-deal/domain/event/ShareDealStartedEvent';
import { ChatRepositoryPort } from '../../../application/port/out/ChatRepositoryPort';
import { Chat } from '../../../domain/Chat';
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
  ) {}

  @OnEvent(ChatWrittenEvent.EVENT_NAME, { async: true })
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

  @OnEvent(ShareDealStartedEvent.EVENT_NAME, { async: true })
  async handleShareDealStartedEvent(event: ShareDealStartedEvent) {
    await pipe(
      this.shareDealQueryRepositoryPort.findById(event.shareDealId),
      TE.map((shareDeal) =>
        Chat.createByStartShareDeal(
          shareDeal.id,
          shareDeal.participantInfo.ids,
          shareDeal.ownerId,
        ),
      ),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) =>
        this.eventEmitterPort.emit(ChatWrittenEvent.EVENT_NAME, chats),
      ),
    )();
  }
}
