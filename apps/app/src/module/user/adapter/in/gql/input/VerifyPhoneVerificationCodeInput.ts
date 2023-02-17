import { Field, InputType } from '@nestjs/graphql';

import { VerifyPhoneVerificationCodeCommand } from '../../../../application/port/in/dto/VerifyPhoneVerificationCodeCommand';
import type { UserId } from '../../../../domain/User';

@InputType()
export class VerifyPhoneVerificationCodeInput {
  @Field()
  code: string;

  toCommand(userId: UserId): VerifyPhoneVerificationCodeCommand {
    return new VerifyPhoneVerificationCodeCommand(userId, this.code);
  }
}
