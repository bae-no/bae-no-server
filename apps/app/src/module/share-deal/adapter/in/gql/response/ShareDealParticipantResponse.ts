import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { User } from '../../../../../user/domain/User';

@ObjectType()
export class ShareDealParticipantResponse {
  @Field(() => ID)
  id: string;

  @Field()
  nickname: string;

  @Field()
  introduce: string;

  @Field()
  isOwner: boolean;

  @Field()
  isMe: boolean;

  static of(user: User, isMe: boolean, isOwner: boolean) {
    const response = new ShareDealParticipantResponse();
    response.id = user.id;
    response.nickname = user.nickname;
    response.introduce = user.profile.introduce;
    response.isOwner = isOwner;
    response.isMe = isMe;

    return response;
  }
}
