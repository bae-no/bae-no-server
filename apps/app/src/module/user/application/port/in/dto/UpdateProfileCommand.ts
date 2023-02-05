import { UserId } from '../../../../domain/User';

export class UpdateProfileCommand {
  constructor(readonly userId: UserId, readonly introduce: string) {}
}
