import { Module } from '@nestjs/common';

import { SampleResolver } from './SampleResolver';
import { SampleService } from './SampleService';

@Module({
  providers: [SampleResolver, SampleService],
})
export class SampleModule {}
