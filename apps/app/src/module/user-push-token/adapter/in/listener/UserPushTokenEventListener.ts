import { T, pipe } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { OnDomainEvent } from '@app/event-emitter/decorator/OnDomainEvent';
import { liveTracer } from '@app/monitoring/init';

import { ChatWrittenEvent } from '../../../../chat/domain/event/ChatWrittenEvent';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';

@Service()
export class UserPushTokenEventListener {
  constructor(
    private readonly userPushTokenQueryRepositoryPort: UserPushTokenQueryRepositoryPort,
    private readonly pushMessagePort: PushMessagePort,
  ) {}

  @OnDomainEvent(ChatWrittenEvent)
  async handleChatWrittenEvent(event: ChatWrittenEvent) {
    const userIds = event.chatsWithoutAuthor.map((chat) => chat.userId);

    if (!userIds.length) {
      return;
    }

    await pipe(
      this.userPushTokenQueryRepositoryPort.findByUserIds(userIds),
      T.chain((tokens) =>
        pipe(
          tokens.map((token) =>
            this.pushMessagePort.send(token.token, event.chats[0].content),
          ),
          T.collectAllPar,
        ),
      ),
      liveTracer,
      T.runPromise,
    );
  }
}
