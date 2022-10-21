import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Chat } from '../../../domain/Chat';

export abstract class ChatQueryRepositoryPort {
  abstract last(shareDealId: string, userId: string): TaskEither<DBError, Chat>;

  abstract unreadCount(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, number>;
}
