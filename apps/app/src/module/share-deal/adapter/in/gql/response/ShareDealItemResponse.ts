import { CoordinateResponse } from '@app/custom/nest/response/CoordinateResponse';
import { Field, ID, ObjectType, Int } from '@nestjs/graphql';

import { ShareDeal } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../../domain/vo/ShareDealStatus';

@ObjectType()
export class ShareDealItemResponse {
  @Field(() => ID)
  id: string;

  @Field()
  createdAt: Date;

  @Field()
  title: string;

  @Field(() => Int)
  orderPrice: number;

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

  @Field(() => CoordinateResponse)
  coordinate: CoordinateResponse;

  static of(shareDeal: ShareDeal): ShareDealItemResponse {
    const response = new ShareDealItemResponse();

    response.id = shareDeal.id;
    response.createdAt = shareDeal.createdAt;
    response.title = shareDeal.title;
    response.orderPrice = shareDeal.orderPrice;
    response.minParticipants = shareDeal.participantInfo.min;
    response.currentParticipants = shareDeal.participantInfo.current;
    response.status = shareDeal.status;
    response.thumbnail = shareDeal.thumbnail;
    response.category = shareDeal.category;
    response.coordinate = shareDeal.zone.coordinate;

    return response;
  }
}
