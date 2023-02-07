import { Field, ID, InputType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import { EndShareDealCommand } from '../../../../application/port/in/dto/EndShareDealCommand';

@InputType()
export class EndShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: UserId) {
    return new EndShareDealCommand(userId, this.shareDealId);
  }
}
