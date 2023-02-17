import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsPositive, Min, ValidateNested } from 'class-validator';

import { CreateShareZoneInput } from './CreateShareZoneInput';
import type { UserId } from '../../../../../user/domain/User';
import { OpenShareDealCommand } from '../../../../application/port/in/dto/OpenShareDealCommand';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

@InputType()
export class OpenShareDealInput {
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

  toCommand(userId: UserId): OpenShareDealCommand {
    return new OpenShareDealCommand(
      userId,
      this.title,
      this.category,
      this.maxParticipant,
      this.orderPrice,
      this.storeName,
      this.thumbnail,
      this.shareZone.addressSystem,
      this.shareZone.addressPath,
      this.shareZone.addressDetail,
      this.shareZone.latitude,
      this.shareZone.longitude,
    );
  }
}
