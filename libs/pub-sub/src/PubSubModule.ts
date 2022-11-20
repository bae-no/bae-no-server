import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { PubSubAdapter } from './PubSubAdapter';

@Global()
@Module({
  providers: [
    { provide: PubSubPort, useFactory: () => new PubSubAdapter(new PubSub()) },
  ],
  exports: [PubSubPort],
})
export class PubSubModule {}
