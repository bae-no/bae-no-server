import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../user/domain/User';
import type { Chat } from '../../../domain/Chat';

export abstract class ChatRepositoryPort {
  abstract create(chats: Chat[]): T.IO<DBError, Chat[]>;

  abstract updateRead(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError, void>;
}
