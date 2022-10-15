import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { WriteChatCommand } from './dto/WriteChatCommand';

export abstract class ChatCommandUseCase {
  abstract write(command: WriteChatCommand): TaskEither<DBError, void>;
}
