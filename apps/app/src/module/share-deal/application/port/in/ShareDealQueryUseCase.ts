import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealAccessDeniedException } from './exception/ShareDealAccessDeniedException';

export abstract class ShareDealQueryUseCase {
  abstract isParticipant(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError | ShareDealAccessDeniedException, void>;
}
