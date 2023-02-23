import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { Chat } from '../../../domain/Chat';

export abstract class ChatRepositoryPort {
  abstract create(chats: Chat[]): TaskEither<DBError, Chat[]>;

  abstract updateRead(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError, void>;
}
