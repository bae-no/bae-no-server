import { SmsPort } from '@app/domain/notification/SmsPort';
import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { Module } from '@nestjs/common';

import { SmsToastService } from './SmsToastService';

@Module({
  providers: [
    {
      provide: SmsPort,
      useClass: SmsToastService,
    },
  ],
  imports: [HttpClientModule],
  exports: [SmsPort],
})
export class SmsModule {}
