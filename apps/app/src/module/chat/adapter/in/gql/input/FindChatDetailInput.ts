import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

import { UserId } from '../../../../../user/domain/User';
import { FindChatByUserCommand } from '../../../../application/port/in/dto/FindChatByUserCommand';

@InputType()
export class FindChatDetailInput {
  @Field(() => ID)
  shareDealId: string;

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
