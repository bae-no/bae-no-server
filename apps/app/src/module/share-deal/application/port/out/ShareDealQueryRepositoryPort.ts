import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDeal } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { FindByUserShareDealCommand } from './dto/FindByUserShareDealCommand';
import { FindShareDealByNearestCommand } from './dto/FindShareDealByNearestCommand';
import { FindShareDealCommand } from './dto/FindShareDealCommand';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(
    command: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract count(command: FindShareDealCommand): TaskEither<DBError, number>;

  abstract findByNearest(
    command: FindShareDealByNearestCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findByUser(
    command: FindByUserShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findById(
    id: string,
  ): TaskEither<DBError | NotFoundException, ShareDeal>;

  abstract countByStatus(
    userId: string,
    status: ShareDealStatus,
  ): TaskEither<DBError, number>;
}
