import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsPositive, Min } from 'class-validator';

import { FindChatByUserCommand } from '../../../../application/port/in/dto/FindChatByUserCommand';

@InputType()
export class FindChatDetailInput {
  @Field(() => ID)
  shareDealId: string;

  @Field(() => Int, { description: '페이지 번호, 0부터 시작' })
  @Min(0)
  page: number;

  @Field(() => Int)
  @IsPositive()
  size: number;

  toCommand(userId: string): FindChatByUserCommand {
    return new FindChatByUserCommand(
      this.shareDealId,
      userId,
      this.page,
      this.size,
    );
  }
}
