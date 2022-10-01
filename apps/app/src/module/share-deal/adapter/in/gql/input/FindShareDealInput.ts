import { Field, InputType } from '@nestjs/graphql';
import { IsPositive, Min } from 'class-validator';

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

  @Field({ description: '페이지 번호, 0부터 시작' })
  @Min(0)
  page: number;

  @Field()
  @IsPositive()
  size: number;

  toCommand(): FindShareDealCommand {
    return FindShareDealCommand.of({
      keyword: this.keyword,
      category: this.category,
      sortType: this.sortType,
      page: this.page,
      size: this.size,
    });
  }
}
