import { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Module } from '@nestjs/common';
import { right, TaskEither } from 'fp-ts/TaskEither';

export class StubPushMessage extends PushMessagePort {
  pushToken = '';
  content = '';

  clear() {
    this.pushToken = '';
    this.content = '';
  }

  send(
    pushToken: string,
    content: string,
  ): TaskEither<NotificationError, void> {
    this.pushToken = pushToken;
    this.content = content;

    return right(undefined);
  }
}

@Module({
  providers: [{ provide: PushMessagePort, useClass: StubPushMessage }],
  exports: [PushMessagePort],
})
export class StubPushMessageModule {}
