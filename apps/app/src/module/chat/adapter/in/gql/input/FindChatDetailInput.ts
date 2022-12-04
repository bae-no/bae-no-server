import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsPositive, Min } from 'class-validator';

import { FindChatByUserCommand } from '../../../../application/port/in/dto/FindChatByUserCommand';

@InputType()
export class FindChatDetailInput {
  @Field(() => ID)
  shareDealId: string;

  @Field(() => Int, {
    description: '커서 페이지네이션 용 타임스탬프',
    nullable: true,
  })
  @Min(0)
  timestamp?: number;

  @Field(() => Int)
  @IsPositive()
  size: number;

  toCommand(userId: string): FindChatByUserCommand {
    return new FindChatByUserCommand(
      this.shareDealId,
      userId,
      this.timestamp,
      this.size,
    );
  }
}
