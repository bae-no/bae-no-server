import { UserId } from '../../../../../user/domain/User';

export class WriteChatCommand {
  constructor(
    readonly userId: UserId,
    readonly shareDealId: string,
    readonly content: string,
  ) {}
}
