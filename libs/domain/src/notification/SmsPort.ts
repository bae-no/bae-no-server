import { NotificationError } from '@app/domain/error/NotificationError';
import { TaskEither } from 'fp-ts/TaskEither';

export abstract class SmsPort {
  abstract send(
    phoneNumber: string,
    content: string,
  ): TaskEither<NotificationError, void>;
}
