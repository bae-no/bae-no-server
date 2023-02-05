import { UserId } from '../../../../../user/domain/User';

export class LeaveShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: string) {}
}
