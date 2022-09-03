import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { FindShareDealCommand } from './dto/FindShareDealCommand';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(
    command: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract countByStatus(
    userId: string,
    status: ShareDealStatus,
  ): TaskEither<DBError, number>;
}
