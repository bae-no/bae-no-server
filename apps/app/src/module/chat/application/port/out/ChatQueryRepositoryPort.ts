import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Chat } from '../../../domain/Chat';

export abstract class ChatQueryRepositoryPort {
  abstract last(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, Option<Chat>>;

  abstract unreadCount(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, number>;
}
