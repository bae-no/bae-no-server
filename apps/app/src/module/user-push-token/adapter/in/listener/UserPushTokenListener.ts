import { RNEA, TE } from '@app/custom/fp-ts';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';

import { ChatWrittenEvent } from '../../../../chat/domain/event/ChatWrittenEvent';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';

export class UserPushTokenListener {
  constructor(
    private readonly userPushTokenQueryRepositoryAdapter: UserPushTokenQueryRepositoryPort,
    private readonly pushMessagePort: PushMessagePort,
  ) {}

  @OnEvent(ChatWrittenEvent.EVENT_NAME, { async: true })
  async handleChatWrittenEvent(event: ChatWrittenEvent) {
    await pipe(
      RNEA.fromArray(event.chatsWithoutAuthor),
      TE.fromOption(() => undefined),
      TE.map(RNEA.map((chat) => chat.id)),
      TE.chainW((ids) =>
        this.userPushTokenQueryRepositoryAdapter.findByUserIds(ids),
      ),
      TE.chainW((tokens) =>
        TE.sequenceArray(
          tokens.map((token) =>
            this.pushMessagePort.send(token.token, event.chats[0].content),
          ),
        ),
      ),
    )();
  }
}
