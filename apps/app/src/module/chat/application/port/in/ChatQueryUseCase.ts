import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { FindByUserDto } from './dto/FindByUserDto';
import { FindChatByUserCommand } from './dto/FindChatByUserCommand';
import { FindChatCommand } from './dto/FindChatCommand';
import { FindChatResult } from './dto/FindChatResult';

export abstract class ChatQueryUseCase {
  abstract find(
    command: FindChatCommand,
  ): TaskEither<DBError, FindChatResult[]>;

  abstract findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, FindByUserDto[]>;
}
