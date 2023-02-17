import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ShareDealItemResponse } from './ShareDealItemResponse';
import type { ShareDeal } from '../../../../domain/ShareDeal';

@ObjectType()
export class ShareDealResponse {
  @Field(() => [ShareDealItemResponse])
  items: ShareDealItemResponse[];

  @Field(() => Int)
  total: number;

  static of(items: ShareDeal[], total: number): ShareDealResponse {
    const response = new ShareDealResponse();

    response.items = items.map(ShareDealItemResponse.of);
    response.total = total;

    return response;
  }
}
