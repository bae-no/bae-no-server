import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field()
  expiredAt: Date;
}
