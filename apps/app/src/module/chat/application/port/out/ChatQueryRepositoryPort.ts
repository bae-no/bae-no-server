import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Chat } from '../../../domain/Chat';
import { FindChatByUserCommand } from '../in/dto/FindChatByUserCommand';

export abstract class ChatQueryRepositoryPort {
  abstract findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, Chat[]>;

  abstract last(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, Option<Chat>>;

  abstract unreadCount(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError, number>;
}
