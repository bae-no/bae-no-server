import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { FindByUserDto } from './dto/FindByUserDto';
import type { FindChatByUserCommand } from './dto/FindChatByUserCommand';
import type { FindChatCommand } from './dto/FindChatCommand';
import type { FindChatResult } from './dto/FindChatResult';

export abstract class ChatQueryUseCase {
  abstract find(command: FindChatCommand): T.IO<DBError, FindChatResult[]>;

  abstract findByUser(
    command: FindChatByUserCommand,
  ): T.IO<DBError, FindByUserDto[]>;
}
