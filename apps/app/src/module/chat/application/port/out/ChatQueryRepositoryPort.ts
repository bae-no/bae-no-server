import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import { UserId } from '../../../../user/domain/User';
import { Chat } from '../../../domain/Chat';
import { FindChatByUserCommand } from '../in/dto/FindChatByUserCommand';

export abstract class ChatQueryRepositoryPort {
  abstract findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, Chat[]>;

  abstract last(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, Option<Chat>>;

  abstract unreadCount(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, number>;
}
