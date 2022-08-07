import { SmsPort } from '@app/domain/notification/SmsPort';
import { Module } from '@nestjs/common';

import { SmsToastService } from './SmsToastService';

@Module({
  providers: [
    {
      provide: SmsPort,
      useClass: SmsToastService,
    },
  ],
  exports: [SmsPort],
})
export class SmsModule {}
