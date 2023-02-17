import { Field, ID, InputType } from '@nestjs/graphql';

import type { UserId } from '../../../../../user/domain/User';
import { StartShareDealCommand } from '../../../../application/port/in/dto/StartShareDealCommand';
import { ShareDealId } from '../../../../domain/ShareDeal';

@InputType()
export class StartShareDealInput {
  @Field(() => ID)
  shareDealId: ShareDealId;

  toCommand(userId: UserId) {
    return new StartShareDealCommand(userId, this.shareDealId);
  }
}
