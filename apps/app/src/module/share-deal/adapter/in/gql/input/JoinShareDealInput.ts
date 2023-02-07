import { Field, ID, InputType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import { JoinShareDealCommand } from '../../../../application/port/in/dto/JoinShareDealCommand';
import { ShareDealId } from '../../../../domain/ShareDeal';

@InputType()
export class JoinShareDealInput {
  @Field(() => ID)
  shareDealId: ShareDealId;

  toCommand(userId: UserId) {
    return new JoinShareDealCommand(userId, this.shareDealId);
  }
}
