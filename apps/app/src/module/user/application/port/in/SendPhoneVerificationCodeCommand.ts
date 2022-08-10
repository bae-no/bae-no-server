export class SendPhoneVerificationCodeCommand {
  constructor(readonly id: string, readonly phoneNumber: string) {}
}
