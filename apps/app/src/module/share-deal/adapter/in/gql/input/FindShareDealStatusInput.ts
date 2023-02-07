import { Field, ID, InputType } from '@nestjs/graphql';

import { ShareDealId } from '../../../../domain/ShareDeal';

@InputType()
export class FindShareDealStatusInput {
  @Field(() => ID)
  shareDealId: ShareDealId;
}
