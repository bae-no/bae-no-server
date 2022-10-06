import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

import { ShareDeal } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../../domain/vo/ShareDealStatus';

@ObjectType()
export class ShareDealResponse {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  title: string;

  @Field(() => Int)
  orderPrice: number;

  @Field(() => Int)
  distance: number;

  @Field(() => Int)
  minParticipants: number;

  @Field(() => Int)
  currentParticipants: number;

  @Field()
  thumbnail: string;

  @Field(() => ShareDealStatus)
  status: ShareDealStatus;

  @Field(() => FoodCategory)
  category: FoodCategory;

  static of(shareDeal: ShareDeal): ShareDealResponse {
    const response = new ShareDealResponse();

    response.id = shareDeal.id;
    response.createdAt = shareDeal.createdAt;
    response.title = shareDeal.title;
    response.orderPrice = shareDeal.orderPrice;
    response.distance = 0;
    response.minParticipants = shareDeal.participantInfo.min;
    response.currentParticipants = shareDeal.participantInfo.current;
    response.status = shareDeal.status;
    response.thumbnail = shareDeal.thumbnail;
    response.category = shareDeal.category;

    return response;
  }
}
