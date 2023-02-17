import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { ShareDealAccessDeniedException } from './exception/ShareDealAccessDeniedException';
import type { UserId } from '../../../../user/domain/User';
import type { ShareDealId } from '../../../domain/ShareDeal';

export abstract class ShareDealQueryUseCase {
  abstract isParticipant(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError | ShareDealAccessDeniedException, void>;

  abstract participantIds(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<
    DBError | NotFoundException | ShareDealAccessDeniedException,
    UserId[]
  >;
}
