import type { T } from '@app/custom/effect';
import type { NotificationError } from '@app/domain/error/NotificationError';

export abstract class SmsPort {
  abstract send(
    phoneNumber: string,
    content: string,
  ): T.IO<NotificationError, void>;
}
