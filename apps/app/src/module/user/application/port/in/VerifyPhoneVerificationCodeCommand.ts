export class VerifyPhoneVerificationCodeCommand {
  constructor(readonly userId: string, readonly code: string) {}
}
