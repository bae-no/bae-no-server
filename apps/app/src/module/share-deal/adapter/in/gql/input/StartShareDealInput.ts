import { Field, ID, InputType } from '@nestjs/graphql';

import { StartShareDealCommand } from '../../../../application/port/in/dto/StartShareDealCommand';

@InputType()
export class StartShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: string) {
    return new StartShareDealCommand(userId, this.shareDealId);
  }
}
