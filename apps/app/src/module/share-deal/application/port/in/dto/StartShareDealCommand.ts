import type { UserId } from '../../../../../user/domain/User';
import type { ShareDealId } from '../../../../domain/ShareDeal';

export class StartShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: ShareDealId) {}
}
