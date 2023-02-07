import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import { UserId } from '../../../../user/domain/User';
import { Chat } from '../../../domain/Chat';

export abstract class ChatRepositoryPort {
  abstract create(chats: Chat[]): TaskEither<DBError, Chat[]>;

  abstract updateRead(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError, void>;
}
