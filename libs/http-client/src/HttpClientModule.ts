import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { Module } from '@nestjs/common';

import { HttpClientService } from './HttpClientService';

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

@Module({
  providers: [
    {
      provide: HttpClientPort,
      useFactory: async () =>
        new HttpClientService((await dynamicImport('got')).default),
    },
  ],
  exports: [HttpClientPort],
})
export class HttpClientModule {}
