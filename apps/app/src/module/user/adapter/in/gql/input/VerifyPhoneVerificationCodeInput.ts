import { Field, InputType } from '@nestjs/graphql';

import { VerifyPhoneVerificationCodeCommand } from '../../../../application/port/in/VerifyPhoneVerificationCodeCommand';

@InputType()
export class VerifyPhoneVerificationCodeInput {
  @Field()
  code: string;

  toCommand(id: string): VerifyPhoneVerificationCodeCommand {
    return new VerifyPhoneVerificationCodeCommand(id, this.code);
  }
}
