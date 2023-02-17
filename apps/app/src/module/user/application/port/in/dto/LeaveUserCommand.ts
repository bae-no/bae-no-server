import type { UserId } from '../../../../domain/User';

export class LeaveUserCommand {
  constructor(
    readonly userId: UserId,
    readonly name: string,
    readonly reason: string,
  ) {}
}
