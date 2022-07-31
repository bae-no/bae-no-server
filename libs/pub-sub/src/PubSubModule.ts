import { Module } from '@nestjs/common';

import { PubSubService } from './PubSubService';

@Module({
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
