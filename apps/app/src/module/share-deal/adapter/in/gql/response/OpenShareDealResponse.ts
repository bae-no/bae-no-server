import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ShareDealId } from '../../../../domain/ShareDeal';

@ObjectType()
export class OpenShareDealResponse {
  @Field(() => ID)
  shareDealId: ShareDealId;

  static of(id: ShareDealId): OpenShareDealResponse {
    const response = new OpenShareDealResponse();

    response.shareDealId = id;

    return response;
  }
}
