import { Field, InputType } from '@nestjs/graphql';

import { SendPhoneVerificationCodeCommand } from '../../../../application/port/in/SendPhoneVerificationCodeCommand';

@InputType()
export class SendPhoneVerificationCodeInput {
  @Field()
  phoneNumber: string;

  toCommand(id: string): SendPhoneVerificationCodeCommand {
    return new SendPhoneVerificationCodeCommand(id, this.phoneNumber);
  }
}