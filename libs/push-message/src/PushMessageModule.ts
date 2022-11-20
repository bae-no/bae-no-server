import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { PushMessageAdapter } from '@app/push-message/PushMessageAdapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as app from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: PushMessagePort,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const messaging = app
          .initializeApp({
            credential: app.credential.cert({
              projectId: configService.get('FIREBASE_PROJECT_ID'),
              clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
              privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
            }),
          })
          .messaging();

        return new PushMessageAdapter(messaging);
      },
    },
  ],
  exports: [PushMessagePort],
})
export class PushMessageModule {}
