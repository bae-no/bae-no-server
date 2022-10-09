import { Field, ID, InputType } from '@nestjs/graphql';

import { JoinShareDealCommand } from '../../../../application/port/in/dto/JoinShareDealCommand';

@InputType()
export class JoinShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: string) {
    return new JoinShareDealCommand(userId, this.shareDealId);
  }
}
