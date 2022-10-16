import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ChatPermissionDeniedException } from './exception/ChatPermissionDeniedException';

export abstract class ChatQueryUseCase {
  abstract isParticipant(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError | ChatPermissionDeniedException, void>;
}
