import type { ShareDealId } from '../../../../share-deal/domain/ShareDeal';

export const ChatWrittenTrigger = (shareDealId: ShareDealId) =>
  `chat.${shareDealId}.written`;
