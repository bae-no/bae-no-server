import { Field, ObjectType } from '@nestjs/graphql';

import type { User } from '../../../../domain/User';

@ObjectType()
export class UserProfileResponse {
  @Field()
  nickname: string;

  @Field()
  introduce: string;

  static of(user: User): UserProfileResponse {
    const response = new UserProfileResponse();

    response.nickname = user.nickname;
    response.introduce = user.profile.introduce;

    return response;
  }
}
