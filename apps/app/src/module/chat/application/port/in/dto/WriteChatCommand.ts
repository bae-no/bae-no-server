import { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import { UserId } from '../../../../../user/domain/User';

export class WriteChatCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: ShareDealId,
    readonly content: string,
  ) {}
}
