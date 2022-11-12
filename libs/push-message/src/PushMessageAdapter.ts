import { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Injectable } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

@Injectable()
export class PushMessageAdapter extends PushMessagePort {
  override send(
    pushToken: string,
    content: string,
  ): TaskEither<NotificationError, void> {
    throw new Error(pushToken + content);
  }
}
