import type { UserId } from '../../../../domain/User';

export class DeleteAddressCommand {
  constructor(readonly key: string, readonly userId: UserId) {}
}
