import { SmsPort } from '@app/domain/notification/SmsPort';
import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { Module } from '@nestjs/common';

import { SmsSensService } from './SmsSensService';

@Module({
  providers: [
    {
      provide: SmsPort,
      useClass: SmsSensService,
    },
  ],
  imports: [HttpClientModule],
  exports: [SmsPort],
})
export class SmsModule {}
