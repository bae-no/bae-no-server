import { Module } from '@nestjs/common';

import { HttpClientService } from './HttpClientService';

@Module({
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
