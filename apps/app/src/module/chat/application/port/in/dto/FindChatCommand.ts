import { FindByUserShareDealCommand } from '../../../../../share-deal/application/port/out/dto/FindByUserShareDealCommand';
import type { ShareDealStatus } from '../../../../../share-deal/domain/vo/ShareDealStatus';
import type { UserId } from '../../../../../user/domain/User';

export class FindChatCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealStatus: ShareDealStatus,
    readonly page: number,
    readonly size: number,
  ) {}

  toShareDealCommand(): FindByUserShareDealCommand {
    return new FindByUserShareDealCommand(
      this.userId,
      this.shareDealStatus,
      this.page,
      this.size,
    );
  }
}
