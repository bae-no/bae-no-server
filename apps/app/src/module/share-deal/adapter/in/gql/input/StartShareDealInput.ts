import { Field, ID, InputType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import { StartShareDealCommand } from '../../../../application/port/in/dto/StartShareDealCommand';

@InputType()
export class StartShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: UserId) {
    return new StartShareDealCommand(userId, this.shareDealId);
  }
}
