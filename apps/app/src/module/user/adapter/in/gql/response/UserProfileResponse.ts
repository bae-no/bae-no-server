import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../../../domain/User';

@ObjectType()
export class UserProfileResponse {
  @Field()
  nickname: string;

  @Field()
  phoneNumber: string;

  @Field()
  imageUri: string;

  @Field()
  introduce: string;

  static of(user: User): UserProfileResponse {
    const response = new UserProfileResponse();

    response.nickname = user.nickname;
    response.phoneNumber = user.phoneNumber;
    response.imageUri = user.profile.uri;
    response.introduce = user.profile.introduce;

    return response;
  }
}
