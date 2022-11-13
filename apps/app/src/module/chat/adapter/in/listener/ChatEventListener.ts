import { TE, RNEA, O } from '@app/custom/fp-ts';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';
import { head, ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';

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
  ) {}

  @OnEvent(ChatWrittenEvent.EVENT_NAME, { async: true })
  handleChatWrittenEvent(payload: ReadonlyNonEmptyArray<Chat>) {
    pipe(head(payload), (chat) =>
      this.pubSubPort.publish(
        ChatWrittenTrigger(chat.shareDealId),
        ChatWrittenResponse.of(chat.message),
      ),
    );
  }

  @OnEvent(ShareDealStartedEvent.EVENT_NAME, { async: true })
  async handleShareDealStartedEvent(shareDealId: string) {
    await pipe(
      this.shareDealQueryRepositoryPort.findById(shareDealId),
      TE.map((shareDeal) =>
        Chat.createByStartShareDeal(
          shareDeal.id,
          shareDeal.participantInfo.ids,
        ),
      ),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) =>
        pipe(
          chats,
          RNEA.fromArray,
          O.map((nonEmptyChats) => this.handleChatWrittenEvent(nonEmptyChats)),
        ),
      ),
    )();
  }
}
