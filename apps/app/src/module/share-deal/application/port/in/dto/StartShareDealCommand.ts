import { UserId } from '../../../../../user/domain/User';
import { ShareDealId } from '../../../../domain/ShareDeal';

export class StartShareDealCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: ShareDealId,
  ) {}
}
