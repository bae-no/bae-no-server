import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';
import type { User } from '../../../../user/domain/User';
import type { Chat } from '../../../domain/Chat';

export interface ChatWrittenPayload {
  chat: Chat;
  author: User;
}

export const ChatWrittenTrigger = (shareDealId: ShareDealId) =>
  `chat.${shareDealId}.written`;
