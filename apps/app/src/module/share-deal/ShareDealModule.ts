import { Module } from '@nestjs/common';

import { ShareDealMutationResolver } from './adapter/in/gql/ShareDealMutationResolver';
import { ShareDealQueryResolver } from './adapter/in/gql/ShareDealQueryResolver';
import { ShareDealQueryRepositoryAdapter } from './adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { ShareDealRepositoryAdapter } from './adapter/out/persistence/ShareDealRepositoryAdapter';
import { ShareDealCommandUseCase } from './application/port/in/ShareDealCommandUseCase';
import { ShareDealQueryUseCase } from './application/port/in/ShareDealQueryUseCase';
import { ShareDealQueryRepositoryPort } from './application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealRepositoryPort } from './application/port/out/ShareDealRepositoryPort';
import { ShareDealCommandService } from './application/service/ShareDealCommandService';
import { ShareDealQueryService } from './application/service/ShareDealQueryService';
import { UserModule } from '../user/UserModule';

@Module({
  imports: [UserModule],
  providers: [
    ShareDealQueryResolver,
    ShareDealMutationResolver,
    {
      provide: ShareDealRepositoryPort,
      useClass: ShareDealRepositoryAdapter,
    },
    {
      provide: ShareDealQueryRepositoryPort,
      useClass: ShareDealQueryRepositoryAdapter,
    },
    {
      provide: ShareDealCommandUseCase,
      useClass: ShareDealCommandService,
    },
    {
      provide: ShareDealQueryUseCase,
      useClass: ShareDealQueryService,
    },
  ],
  exports: [ShareDealQueryUseCase, ShareDealQueryRepositoryPort],
})
export class ShareDealModule {}
