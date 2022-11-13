import { Module } from '@nestjs/common';

import { UserQueryRepositoryAdapter } from '../user/adapter/out/persistence/UserQueryRepositoryAdapter';
import { UserQueryRepositoryPort } from '../user/application/port/out/UserQueryRepositoryPort';
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

@Module({
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
    {
      provide: UserQueryRepositoryPort,
      useClass: UserQueryRepositoryAdapter,
    },
  ],
})
export class ShareDealModule {}
