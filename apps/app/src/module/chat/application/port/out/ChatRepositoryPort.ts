import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Chat } from '../../../domain/Chat';

export abstract class ChatRepositoryPort {
  abstract create(chats: Chat[]): TaskEither<DBError, Chat[]>;
}
