import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { Chat } from '../../../domain/Chat';
import type { FindChatByUserCommand } from '../in/dto/FindChatByUserCommand';

export abstract class ChatQueryRepositoryPort {
  abstract findByUser(command: FindChatByUserCommand): T.IO<DBError, Chat[]>;

  abstract last(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, Option<Chat>>;

  abstract unreadCount(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, number>;
}
