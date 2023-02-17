import { Field, ObjectType } from '@nestjs/graphql';

import type { SignInUserDto } from '../../../../application/port/in/dto/SignInUserDto';

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

  static of(dto: SignInUserDto): SignInResponse {
    const response = new SignInResponse();

    response.accessToken = dto.authToken.accessToken;
    response.expiredAt = dto.authToken.expiredAt;
    response.isPhoneNumberVerified = dto.user.isPhoneNumberVerified;
    response.hasProfile = dto.user.hasProfile;

    return response;
  }
}
