import type { T } from '@app/custom/effect';
import type { NotificationError } from '@app/domain/error/NotificationError';

export abstract class PushMessagePort {
  abstract send(
    pushToken: string,
    content: string,
  ): T.IO<NotificationError, void>;
}
