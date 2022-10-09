import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { JoinChatCommand } from './dto/JoinChatCommand';

export abstract class ChatCommandUseCase {
  abstract join(command: JoinChatCommand): TaskEither<DBError, void>;
}
