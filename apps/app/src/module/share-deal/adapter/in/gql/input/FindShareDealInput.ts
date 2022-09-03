import { Field, InputType } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';

import { FindShareDealCommand } from '../../../../application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../../application/port/out/dto/ShareDealSortType';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

@InputType()
export class FindShareDealInput {
  @Field({ nullable: true })
  keyword?: string;

  @Field(() => FoodCategory, { nullable: true })
  category?: FoodCategory;

  @Field(() => ShareDealSortType, { nullable: true })
  sortType: ShareDealSortType;

  @Field()
  @IsPositive()
  size: number;

  @Field({ nullable: true })
  cursor?: Date;

  toCommand(): FindShareDealCommand {
    return FindShareDealCommand.of({
      keyword: this.keyword,
      category: this.category,
      sortType: this.sortType,
      size: this.size,
      cursor: this.cursor,
    });
  }
}
