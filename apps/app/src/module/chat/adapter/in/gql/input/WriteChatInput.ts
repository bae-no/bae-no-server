import { Field, ID, InputType } from '@nestjs/graphql';

import { WriteChatCommand } from '../../../../application/port/in/dto/WriteChatCommand';

@InputType()
export class WriteChatInput {
  @Field(() => ID)
  shareDealId: string;

  @Field()
  content: string;

  toCommand(userId: string): WriteChatCommand {
    return new WriteChatCommand(userId, this.shareDealId, this.content);
  }
}
