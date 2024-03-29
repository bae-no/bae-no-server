import { Field, ID, InputType } from '@nestjs/graphql';

import type { UserId } from '../../../../../user/domain/User';
import { EndShareDealCommand } from '../../../../application/port/in/dto/EndShareDealCommand';
import { ShareDealId } from '../../../../domain/ShareDeal';

@InputType()
export class LeaveShareDealInput {
  @Field(() => ID)
  shareDealId: ShareDealId;

  toCommand(userId: UserId) {
    return new EndShareDealCommand(userId, this.shareDealId);
  }
}
