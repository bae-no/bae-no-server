import { UserId } from '../../../../domain/User';

export class SendPhoneVerificationCodeCommand {
  constructor(readonly userId: UserId, readonly phoneNumber: string) {}
}
