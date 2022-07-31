import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Global, Module } from '@nestjs/common';

import { PubSubAdapter } from './PubSubAdapter';

@Global()
@Module({
  providers: [PubSubAdapter],
  exports: [{ provide: PubSubPort, useClass: PubSubAdapter }],
})
export class PubSubModule {}
