import { UserId } from '../../../../../user/domain/User';

export class JoinShareDealCommand {
  constructor(readonly userId: UserId, readonly shareDealId: string) {}
}
