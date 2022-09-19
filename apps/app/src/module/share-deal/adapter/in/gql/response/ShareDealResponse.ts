import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ShareDeal } from '../../../../domain/ShareDeal';
import { ShareDealStatus } from '../../../../domain/vo/ShareDealStatus';

@ObjectType()
export class ShareDealResponse {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  title: string;

  @Field()
  orderPrice: number;

  @Field()
  distance: number;

  @Field()
  minParticipants: number;

  @Field()
  currentParticipants: number;

  @Field()
  thumbnail: string;

  @Field(() => ShareDealStatus)
  status: ShareDealStatus;

  static of(shareDeal: ShareDeal): ShareDealResponse {
    const response = new ShareDealResponse();

    response.id = shareDeal.id;
    response.createdAt = shareDeal.createdAt;
    response.title = shareDeal.title;
    response.orderPrice = shareDeal.orderPrice;
    response.distance = 0;
    response.minParticipants = shareDeal.minParticipants;
    response.currentParticipants = shareDeal.participantCount;
    response.status = shareDeal.status;
    response.thumbnail = shareDeal.thumbnail;

    return response;
  }
}
