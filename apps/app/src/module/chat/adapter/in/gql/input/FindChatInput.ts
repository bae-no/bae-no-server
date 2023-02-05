import { Field, InputType, Int } from '@nestjs/graphql';
import { IsPositive, Min } from 'class-validator';

import { ShareDealStatus } from '../../../../../share-deal/domain/vo/ShareDealStatus';
import { UserId } from '../../../../../user/domain/User';
import { FindChatCommand } from '../../../../application/port/in/dto/FindChatCommand';

@InputType()
export class FindChatInput {
  @Field(() => ShareDealStatus)
  status: ShareDealStatus;

  @Field(() => Int, { description: '페이지 번호, 0부터 시작' })
  @Min(0)
  page: number;

  @Field(() => Int)
  @IsPositive()
  size: number;

  toCommand(userId: UserId): FindChatCommand {
    return new FindChatCommand(userId, this.status, this.page, this.size);
  }
}
