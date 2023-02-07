import { UserId } from '../../../../../user/domain/User';
import { ShareDealId } from '../../../../domain/ShareDeal';

export class JoinShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: ShareDealId) {}
}
