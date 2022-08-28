import { Module } from '@nestjs/common';

import { ShareDealRepositoryAdapter } from './adapter/out/persistence/ShareDealRepositoryAdapter';
import { ShareDealCommandUseCase } from './application/port/in/ShareDealCommandUseCase';
import { ShareDealRepositoryPort } from './application/port/out/ShareDealRepositoryPort';
import { ShareDealCommandService } from './application/service/ShareDealCommandService';

@Module({
  providers: [
    {
      provide: ShareDealRepositoryPort,
      useClass: ShareDealRepositoryAdapter,
    },
    {
      provide: ShareDealCommandUseCase,
      useClass: ShareDealCommandService,
    },
  ],
})
export class ShareDealModule {}
