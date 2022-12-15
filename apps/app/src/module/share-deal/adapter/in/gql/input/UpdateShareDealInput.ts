import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsPositive, Min, ValidateNested } from 'class-validator';

import { UpdateShareDealCommand } from '../../../../application/port/in/dto/UpdateShareDealCommand';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { CreateShareZoneInput } from './CreateShareZoneInput';

@InputType()
export class UpdateShareDealInput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => FoodCategory)
  category: FoodCategory;

  @Field(() => Int)
  @Min(2)
  maxParticipant: number;

  @Field(() => Int)
  @IsPositive()
  orderPrice: number;

  @Field()
  storeName: string;

  @Field()
  thumbnail: string;

  @Field(() => CreateShareZoneInput)
  @Type(() => CreateShareZoneInput)
  @ValidateNested()
  shareZone: CreateShareZoneInput;

  toCommand(userId: string): UpdateShareDealCommand {
    return new UpdateShareDealCommand(
      userId,
      this.id,
      this.title,
      this.category,
      this.maxParticipant,
      this.orderPrice,
      this.storeName,
      this.thumbnail,
      this.shareZone.addressRoad,
      this.shareZone.addressDetail,
      this.shareZone.latitude,
      this.shareZone.longitude,
    );
  }
}
