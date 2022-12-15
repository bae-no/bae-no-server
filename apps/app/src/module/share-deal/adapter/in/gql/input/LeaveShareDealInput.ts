import { Field, ID, InputType } from '@nestjs/graphql';

import { EndShareDealCommand } from '../../../../application/port/in/dto/EndShareDealCommand';

@InputType()
export class LeaveShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: string) {
    return new EndShareDealCommand(userId, this.shareDealId);
  }
}
