import { UserId } from '../../../../../user/domain/User';

export class EndShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: string) {}
}
