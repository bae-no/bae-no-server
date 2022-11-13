import { TE, RNEA } from '@app/custom/fp-ts';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';
import { head, ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';

import { Chat } from '../../../../chat/domain/Chat';
import { ChatWrittenEvent } from '../../../../chat/domain/event/ChatWrittenEvent';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';

@Injectable()
export class UserPushTokenListener {
  constructor(
    private readonly userPushTokenQueryRepositoryAdapter: UserPushTokenQueryRepositoryPort,
    private readonly pushMessagePort: PushMessagePort,
  ) {}

  @OnEvent(ChatWrittenEvent.EVENT_NAME, { async: true })
  async handleChatWrittenEvent(payload: ReadonlyNonEmptyArray<Chat>) {
    await pipe(
      this.userPushTokenQueryRepositoryAdapter.findByUserIds(
        pipe(
          payload,
          RNEA.map((p) => p.userId),
        ),
      ),
      TE.chainW((tokens) =>
        TE.sequenceArray(
          tokens.map((token) =>
            this.pushMessagePort.send(token.token, head(payload).content),
          ),
        ),
      ),
    )();
  }
}
