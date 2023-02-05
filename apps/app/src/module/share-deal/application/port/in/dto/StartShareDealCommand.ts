import { UserId } from '../../../../../user/domain/User';

export class StartShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: string) {}
}
