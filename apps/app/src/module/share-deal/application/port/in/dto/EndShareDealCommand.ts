import { UserId } from '../../../../../user/domain/User';
import { ShareDealId } from '../../../../domain/ShareDeal';

export class EndShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: ShareDealId) {}
}
