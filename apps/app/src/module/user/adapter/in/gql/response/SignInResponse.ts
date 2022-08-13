import { Field, ObjectType } from '@nestjs/graphql';

import { AuthToken } from '../../../../application/port/in/dto/AuthToken';

@ObjectType()
export class SignInResponse {
  @Field()
  accessToken: string;

  @Field({ description: '토큰 만료일' })
  expiredAt: Date;

  @Field({ description: '전화번호 인증여부' })
  isPhoneNumberVerified: boolean;

  @Field({ description: '닉네임 및 주소 입력여부' })
  hasProfile: boolean;

  static of(authToken: AuthToken): SignInResponse {
    const response = new SignInResponse();

    response.accessToken = authToken.accessToken;
    response.expiredAt = authToken.expiredAt;

    return response;
  }
}
