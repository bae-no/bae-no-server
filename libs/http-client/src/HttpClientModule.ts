import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { Module } from '@nestjs/common';

import { HttpClientService } from './HttpClientService';

@Module({
  providers: [{ provide: HttpClientPort, useClass: HttpClientService }],
  exports: [HttpClientPort],
})
export class HttpClientModule {}
