import type { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../../user/domain/User';

export class WriteChatCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: ShareDealId,
    readonly content: string,
  ) {}
}
