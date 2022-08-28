import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsPositive, Min, ValidateNested } from 'class-validator';

import { OpenShareDealCommand } from '../../../../application/port/in/dto/OpenShareDealCommand';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';
import { CreateShareZoneInput } from './CreateShareZoneInput';

@InputType()
export class OpenShareDealInput {
  @Field()
  title: string;

  @Field(() => FoodCategory)
  category: FoodCategory;

  @Field()
  @Min(2)
  minParticipants: number;

  @Field()
  @IsPositive()
  orderPrice: number;

  @Field()
  storeName: string;

  @Field(() => CreateShareZoneInput)
  @Type(() => CreateShareZoneInput)
  @ValidateNested()
  shareZone: CreateShareZoneInput;

  toCommand(userId: string): OpenShareDealCommand {
    return new OpenShareDealCommand(
      userId,
      this.title,
      this.category,
      this.minParticipants,
      this.orderPrice,
      this.storeName,
      this.shareZone.addressRoad,
      this.shareZone.addressDetail,
      this.shareZone.latitude,
      this.shareZone.longitude,
    );
  }
}
