import { Field, ID, InputType } from '@nestjs/graphql';

import { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import { UserId } from '../../../../../user/domain/User';
import { WriteChatCommand } from '../../../../application/port/in/dto/WriteChatCommand';

@InputType()
export class WriteChatInput {
  @Field(() => ID)
  shareDealId: ShareDealId;

  @Field()
  content: string;

  toCommand(userId: UserId): WriteChatCommand {
    return new WriteChatCommand(userId, this.shareDealId, this.content);
  }
}
