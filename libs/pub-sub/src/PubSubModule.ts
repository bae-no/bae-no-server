import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Global, Module } from '@nestjs/common';

import { PubSubAdapter } from './PubSubAdapter';

@Global()
@Module({
  providers: [{ provide: PubSubPort, useClass: PubSubAdapter }],
  exports: [PubSubPort],
})
export class PubSubModule {}
