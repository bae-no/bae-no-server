import type { UserId } from '../../../../../user/domain/User';
import type { ShareDealId } from '../../../../domain/ShareDeal';

export class LeaveShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: ShareDealId) {}
}
