import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

import { ChatCommandUseCase } from '../port/in/ChatCommandUseCase';
import { WriteChatCommand } from '../port/in/dto/WriteChatCommand';

@Injectable()
export class ChatCommandService extends ChatCommandUseCase {
  write(command: WriteChatCommand): TaskEither<DBError, void> {
    throw new Error(command.content);
  }
}
