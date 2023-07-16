import { UserId } from '../../../../../user/domain/User';
import { ShareDealId } from '../../../../domain/ShareDeal';

export class LeaveShareDealCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: ShareDealId,
  ) {}
}
