import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { WriteChatCommand } from './dto/WriteChatCommand';
import { ShareDealAccessDeniedException } from '../../../../share-deal/application/port/in/exception/ShareDealAccessDeniedException';

export type WriteChatError =
  | DBError
  | NotFoundException
  | ShareDealAccessDeniedException;

export abstract class ChatCommandUseCase {
  abstract write(command: WriteChatCommand): TaskEither<WriteChatError, void>;
}
