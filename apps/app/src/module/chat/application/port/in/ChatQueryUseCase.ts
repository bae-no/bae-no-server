import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { FindByUserDto } from './dto/FindByUserDto';
import type { FindChatByUserCommand } from './dto/FindChatByUserCommand';
import type { FindChatCommand } from './dto/FindChatCommand';
import type { FindChatResult } from './dto/FindChatResult';

export abstract class ChatQueryUseCase {
  abstract find(
    command: FindChatCommand,
  ): TaskEither<DBError, FindChatResult[]>;

  abstract findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, FindByUserDto[]>;
}
