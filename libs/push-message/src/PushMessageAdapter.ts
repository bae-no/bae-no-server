import { TE } from '@app/custom/fp-ts';
import { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Messaging } from 'firebase-admin/lib/messaging';
import { toError } from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';

export class PushMessageAdapter extends PushMessagePort {
  constructor(private readonly messaging: Messaging) {
    super();
  }

  override send(
    pushToken: string,
    content: string,
  ): TaskEither<NotificationError, void> {
    return pipe(
      tryCatch(
        async () =>
          this.messaging.send({
            token: pushToken,
            notification: { body: content },
          }),
        (e) => new NotificationError(toError(e)),
      ),
      TE.map(constVoid),
    );
  }
}
