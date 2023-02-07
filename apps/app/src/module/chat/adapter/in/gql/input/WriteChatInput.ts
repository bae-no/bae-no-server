import { Field, ID, InputType } from '@nestjs/graphql';

import { UserId } from '../../../../../user/domain/User';
import { WriteChatCommand } from '../../../../application/port/in/dto/WriteChatCommand';

@InputType()
export class WriteChatInput {
  @Field(() => ID)
  shareDealId: string;

  @Field()
  content: string;

  toCommand(userId: UserId): WriteChatCommand {
    return new WriteChatCommand(userId, this.shareDealId, this.content);
  }
}
