import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { WriteChatCommand } from './dto/WriteChatCommand';
import { ChatPermissionDeniedException } from './exception/ChatPermissionDeniedException';

export type WriteChatError =
  | DBError
  | NotFoundException
  | ChatPermissionDeniedException;

export abstract class ChatCommandUseCase {
  abstract write(command: WriteChatCommand): TaskEither<WriteChatError, void>;
}
