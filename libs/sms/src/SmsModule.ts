import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SmsSensService } from './SmsSensService';

@Module({
  providers: [
    {
      provide: SmsPort,
      inject: [HttpClientPort, ConfigService],
      useFactory: (
        httpClientPort: HttpClientPort,
        configService: ConfigService,
      ) =>
        new SmsSensService(
          httpClientPort,
          configService.get('SMS_SERVICE_ID', ''),
          configService.get('SMS_ACCESS_KEY', ''),
          configService.get('SMS_SECRET_KEY', ''),
          configService.get('SMS_SEND_NUMBER', ''),
        ),
    },
  ],
  imports: [HttpClientModule],
  exports: [SmsPort],
})
export class SmsModule {}
