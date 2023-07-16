import { UserId } from '../../../../../user/domain/User';

export class UpdateUserPushTokenCommand {
  constructor(
    readonly userId: UserId,
    readonly token: string,
  ) {}
}
