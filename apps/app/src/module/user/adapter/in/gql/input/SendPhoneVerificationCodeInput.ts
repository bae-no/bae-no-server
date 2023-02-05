import { Field, InputType } from '@nestjs/graphql';

import { SendPhoneVerificationCodeCommand } from '../../../../application/port/in/dto/SendPhoneVerificationCodeCommand';
import { UserId } from '../../../../domain/User';

@InputType()
export class SendPhoneVerificationCodeInput {
  @Field()
  phoneNumber: string;

  toCommand(userId: UserId): SendPhoneVerificationCodeCommand {
    return new SendPhoneVerificationCodeCommand(userId, this.phoneNumber);
  }
}
