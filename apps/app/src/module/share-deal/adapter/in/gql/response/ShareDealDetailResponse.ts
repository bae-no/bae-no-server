import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { ShareZoneResponse } from './ShareZoneResponse';
import { ShareDealId } from '../../../../domain/ShareDeal';
import type { ShareDeal } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

@ObjectType()
export class ShareDealDetailResponse {
  @Field(() => ID)
  id: ShareDealId;

  @Field()
  createdAt: Date;

  @Field()
  title: string;

  @Field(() => Int)
  maxParticipants: number;

  @Field(() => FoodCategory)
  category: FoodCategory;

  @Field()
  storeName: string;

  @Field(() => Int)
  orderPrice: number;

  @Field(() => ShareZoneResponse)
  shareZone: ShareZoneResponse;

  static of(shareDeal: ShareDeal): ShareDealDetailResponse {
    const response = new ShareDealDetailResponse();

    response.id = shareDeal.id;
    response.createdAt = shareDeal.createdAt;
    response.title = shareDeal.title;
    response.maxParticipants = shareDeal.participantInfo.max;
    response.category = shareDeal.category;
    response.storeName = shareDeal.storeName;
    response.orderPrice = shareDeal.orderPrice;
    response.shareZone = ShareZoneResponse.of(shareDeal.zone);

    return response;
  }
}
