import { Field, InputType, Int } from '@nestjs/graphql';
import { IsPositive, Min } from 'class-validator';

import { Coordinate } from '../../../../../user/domain/vo/Coordinate';
import { FindShareDealByNearestCommand } from '../../../../application/port/out/dto/FindShareDealByNearestCommand';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

@InputType()
export class FindShareDealByNearestInput {
  @Field({ nullable: true })
  keyword?: string;

  @Field(() => FoodCategory, { nullable: true })
  category?: FoodCategory;

  @Field(() => Int, { description: '페이지 번호, 0부터 시작' })
  @Min(0)
  page: number;

  @Field(() => Int)
  @IsPositive()
  size: number;

  @Field(() => Int)
  @Min(0)
  addressKey: number;

  toCommand(coordinate: Coordinate): FindShareDealByNearestCommand {
    return FindShareDealByNearestCommand.of({
      keyword: this.keyword,
      category: this.category,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      page: this.page,
      size: this.size,
    });
  }
}
