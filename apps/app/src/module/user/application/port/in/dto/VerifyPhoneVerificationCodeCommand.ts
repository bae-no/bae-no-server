import type { UserId } from '../../../../domain/User';

export class VerifyPhoneVerificationCodeCommand {
  constructor(readonly userId: UserId, readonly code: string) {}
}
