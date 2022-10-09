import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { FindShareDealCommand } from './dto/FindShareDealCommand';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(
    command: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findById(
    id: string,
  ): TaskEither<DBError | NotFoundException, ShareDeal>;

  abstract countByStatus(
    userId: string,
    status: ShareDealStatus,
  ): TaskEither<DBError, number>;
}
