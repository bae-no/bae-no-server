import { Module } from '@nestjs/common';

import { SampleMutationResolver } from './adapter/in/gql/SampleMutationResolver';
import { SampleQueryResolver } from './adapter/in/gql/SampleQueryResolver';
import { SampleQueryRepositoryAdapter } from './adapter/out/persistence/SampleQueryRepositoryAdapter';
import { SampleRepositoryAdapter } from './adapter/out/persistence/SampleRepositoryAdapter';
import { SampleCommandUseCase } from './application/port/in/SampleCommandUseCase';
import { SampleQueryUseCase } from './application/port/in/SampleQueryUseCase';
import { SampleQueryRepositoryPort } from './application/port/out/SampleQueryRepositoryPort';
import { SampleRepositoryPort } from './application/port/out/SampleRepositoryPort';
import { SampleCommandService } from './application/service/SampleCommandService';
import { SampleQueryService } from './application/service/SampleQueryService';

@Module({
  providers: [
    SampleQueryResolver,
    SampleMutationResolver,
    {
      provide: SampleQueryUseCase,
      useClass: SampleQueryService,
    },
    {
      provide: SampleCommandUseCase,
      useClass: SampleCommandService,
    },
    {
      provide: SampleQueryRepositoryPort,
      useClass: SampleQueryRepositoryAdapter,
    },
    {
      provide: SampleRepositoryPort,
      useClass: SampleRepositoryAdapter,
    },
  ],
})
export class SampleModule {}
