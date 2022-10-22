import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { FindChatCommand } from './dto/FindChatCommand';
import { FindChatResult } from './dto/FindChatResult';

export abstract class ChatQueryUseCase {
  abstract find(
    command: FindChatCommand,
  ): TaskEither<DBError, FindChatResult[]>;
}
