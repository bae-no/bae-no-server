import { Field, ObjectType } from '@nestjs/graphql';

import { AuthToken } from '../../../../application/port/in/AuthToken';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field()
  expiredAt: Date;

  static of(authToken: AuthToken): SignInResponse {
    const response = new SignInResponse();

    response.accessToken = authToken.accessToken;
    response.expiredAt = authToken.expiredAt;

    return response;
  }
}
