import { T } from '@app/custom/effect';
import type { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Module } from '@nestjs/common';

export class StubPushMessage extends PushMessagePort {
  pushToken = '';
  content = '';

  clear() {
    this.pushToken = '';
    this.content = '';
  }

  send(pushToken: string, content: string): T.IO<NotificationError, void> {
    this.pushToken = pushToken;
    this.content = content;

    return T.unit;
  }
}

@Module({
  providers: [{ provide: PushMessagePort, useClass: StubPushMessage }],
  exports: [PushMessagePort],
})
export class StubPushMessageModule {}
