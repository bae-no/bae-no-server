import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { CountShareDealCommand } from './dto/CountShareDealCommand';
import { FindByUserShareDealCommand } from './dto/FindByUserShareDealCommand';
import { FindShareDealByNearestCommand } from './dto/FindShareDealByNearestCommand';
import { FindShareDealCommand } from './dto/FindShareDealCommand';
import { UserId } from '../../../../user/domain/User';
import { ShareDeal, ShareDealId } from '../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(
    command: FindShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract count(command: CountShareDealCommand): TaskEither<DBError, number>;

  abstract findByNearest(
    command: FindShareDealByNearestCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findByUser(
    command: FindByUserShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findById(
    id: ShareDealId,
  ): TaskEither<DBError | NotFoundException, ShareDeal>;

  abstract countByStatus(
    userId: UserId,
    status: ShareDealStatus,
  ): TaskEither<DBError, number>;
}
