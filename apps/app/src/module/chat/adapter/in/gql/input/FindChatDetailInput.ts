import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

import { ShareDealId } from '../../../../../share-deal/domain/ShareDeal';
import type { UserId } from '../../../../../user/domain/User';
import { FindChatByUserCommand } from '../../../../application/port/in/dto/FindChatByUserCommand';

@InputType()
export class FindChatDetailInput {
  @Field(() => ID)
  shareDealId: ShareDealId;

  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int)
  @IsPositive()
  size: number;

  toCommand(userId: UserId): FindChatByUserCommand {
    return new FindChatByUserCommand(
      this.shareDealId,
      userId,
      this.cursor,
      this.size,
    );
  }
}
