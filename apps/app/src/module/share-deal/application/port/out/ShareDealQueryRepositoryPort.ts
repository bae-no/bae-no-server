import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { CountShareDealCommand } from './dto/CountShareDealCommand';
import type { FindByUserShareDealCommand } from './dto/FindByUserShareDealCommand';
import type { FindShareDealByNearestCommand } from './dto/FindShareDealByNearestCommand';
import type { FindShareDealCommand } from './dto/FindShareDealCommand';
import type { UserId } from '../../../../user/domain/User';
import type { ShareDeal, ShareDealId } from '../../../domain/ShareDeal';
import type { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';

export abstract class ShareDealQueryRepositoryPort {
  abstract find(command: FindShareDealCommand): T.IO<DBError, ShareDeal[]>;

  abstract count(command: CountShareDealCommand): T.IO<DBError, number>;

  abstract findByNearest(
    command: FindShareDealByNearestCommand,
  ): T.IO<DBError, ShareDeal[]>;

  abstract findByUser(
    command: FindByUserShareDealCommand,
  ): TaskEither<DBError, ShareDeal[]>;

  abstract findById(
    id: ShareDealId,
  ): TaskEither<DBError | NotFoundException, ShareDeal>;

  abstract findByIdE(
    id: ShareDealId,
  ): T.IO<DBError | NotFoundException, ShareDeal>;

  abstract countByStatus(
    userId: UserId,
    status: ShareDealStatus,
  ): T.IO<DBError, number>;
}
