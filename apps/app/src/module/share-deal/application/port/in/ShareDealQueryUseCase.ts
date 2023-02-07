import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealAccessDeniedException } from './exception/ShareDealAccessDeniedException';
import { UserId } from '../../../../user/domain/User';
import { ShareDealId } from '../../../domain/ShareDeal';

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
