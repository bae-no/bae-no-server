import { Field, ID, InputType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import { JoinShareDealCommand } from '../../../../application/port/in/dto/JoinShareDealCommand';

@InputType()
export class JoinShareDealInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: UserId) {
    return new JoinShareDealCommand(userId, this.shareDealId);
  }
}
