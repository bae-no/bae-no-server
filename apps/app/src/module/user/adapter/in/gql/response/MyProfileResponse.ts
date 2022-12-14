import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../../../domain/User';

@ObjectType()
export class MyProfileResponse {
  @Field()
  nickname: string;

  @Field()
  phoneNumber: string;

  @Field()
  imageUri: string;

  @Field()
  introduce: string;

  static of(user: User): MyProfileResponse {
    const response = new MyProfileResponse();

    response.nickname = user.nickname;
    response.phoneNumber = user.phoneNumber;
    response.imageUri = user.profile.uri;
    response.introduce = user.profile.introduce;

    return response;
  }
}
