import { Field, InputType } from '@nestjs/graphql';

import { AuthType } from '../../../../domain/AuthType';

@InputType()
export class SignInInput {
  @Field()
  code: string;

  @Field(() => AuthType)
  type: AuthType;
}
