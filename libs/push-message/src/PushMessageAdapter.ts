import { T, constVoid, pipe } from '@app/custom/effect';
import { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import type { Messaging } from 'firebase-admin/lib/messaging';
import { toError } from 'fp-ts/Either';

export class PushMessageAdapter extends PushMessagePort {
  constructor(private readonly messaging: Messaging) {
    super();
  }

  override send(
    pushToken: string,
    content: string,
  ): T.IO<NotificationError, void> {
    return pipe(
      T.tryCatchPromise(
        async () =>
          this.messaging.send({
            token: pushToken,
            notification: { body: content },
          }),
        (e) => new NotificationError(toError(e)),
      ),
      T.map(constVoid),
    );
  }
}
