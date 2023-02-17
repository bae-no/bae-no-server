import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { WriteChatCommand } from './dto/WriteChatCommand';
import type { ShareDealAccessDeniedException } from '../../../../share-deal/application/port/in/exception/ShareDealAccessDeniedException';

export type WriteChatError =
  | DBError
  | NotFoundException
  | ShareDealAccessDeniedException;

export abstract class ChatCommandUseCase {
  abstract write(command: WriteChatCommand): TaskEither<WriteChatError, void>;
}
