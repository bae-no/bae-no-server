import { RNEA, TE } from '@app/custom/fp-ts';
import { Service } from '@app/custom/nest/decorator/Service';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { OnEvent } from '@nestjs/event-emitter';
import { pipe } from 'fp-ts/function';

import { ChatWrittenEvent } from '../../../../chat/domain/event/ChatWrittenEvent';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';

@Service()
export class UserPushTokenEventListener {
  constructor(
    private readonly userPushTokenQueryRepositoryAdapter: UserPushTokenQueryRepositoryPort,
    private readonly pushMessagePort: PushMessagePort,
  ) {}

  @OnEvent(ChatWrittenEvent.name, { async: true })
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
