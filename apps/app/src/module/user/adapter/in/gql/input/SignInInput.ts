import { Field, InputType } from '@nestjs/graphql';

import { SignInUserCommand } from '../../../../application/port/in/SignInUserCommand';
import { AuthType } from '../../../../domain/vo/AuthType';

@InputType()
export class SignInInput {
  @Field()
  code: string;

  @Field(() => AuthType)
  type: AuthType;

  toCommand(): SignInUserCommand {
    return new SignInUserCommand(this.code, this.type);
  }
}
