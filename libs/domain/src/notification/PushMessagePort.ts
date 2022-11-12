import { NotificationError } from '@app/domain/error/NotificationError';
import { TaskEither } from 'fp-ts/TaskEither';

export abstract class PushMessagePort {
  abstract send(
    pushToken: string,
    content: string,
  ): TaskEither<NotificationError, void>;
}
