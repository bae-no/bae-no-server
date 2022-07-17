import { Module } from '@nestjs/common';

import { SampleResolver } from './adapter/in/gql/SampleResolver';
import { SampleRepositoryAdapter } from './adapter/out/persistence/SampleRepositoryAdapter';
import { SampleCommandUseCase } from './application/port/in/SampleCommandUseCase';
import { SampleRepositoryPort } from './application/port/out/SampleRepositoryPort';
import { SampleCommandService } from './application/service/SampleCommandService';

@Module({
  providers: [
    SampleResolver,
    {
      provide: SampleCommandUseCase,
      useClass: SampleCommandService,
    },
    {
      provide: SampleRepositoryPort,
      useClass: SampleRepositoryAdapter,
    },
  ],
})
export class SampleModule {}
