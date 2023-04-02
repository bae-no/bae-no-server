import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ShareDealItemResponse } from './ShareDealItemResponse';
import type { UserId } from '../../../../../user/domain/User';
import type { ShareDeal } from '../../../../domain/ShareDeal';

@ObjectType()
export class ShareDealResponse {
  @Field(() => [ShareDealItemResponse])
  items: ShareDealItemResponse[];

  @Field(() => Int)
  total: number;

  static of(
    items: ShareDeal[],
    total: number,
    userId: UserId,
  ): ShareDealResponse {
    const response = new ShareDealResponse();

    response.items = items.map((item) =>
      ShareDealItemResponse.of(item, userId),
    );
    response.total = total;

    return response;
  }
}
