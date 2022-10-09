import { Field, ID, InputType } from '@nestjs/graphql';

import { JoinChatCommand } from '../../../../application/port/in/dto/JoinChatCommand';

@InputType()
export class JoinChatInput {
  @Field(() => ID)
  shareDealId: string;

  toCommand(userId: string) {
    return new JoinChatCommand(userId, this.shareDealId);
  }
}
