import { TE } from '@app/custom/fp-ts';
import { NotificationError } from '@app/domain/error/NotificationError';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as app from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging';
import { toError } from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';

@Injectable()
export class PushMessageAdapter extends PushMessagePort {
  private readonly messaging: Messaging;

  constructor(configService: ConfigService) {
    super();
    this.messaging = app
      .initializeApp({
        credential: app.credential.cert({
          projectId: configService.get('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
          privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
        }),
      })
      .messaging();
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
