import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsPositive, Min, ValidateNested } from 'class-validator';

import { CreateShareZoneInput } from './CreateShareZoneInput';
import { UserId } from '../../../../../user/domain/User';
import { UpdateShareDealCommand } from '../../../../application/port/in/dto/UpdateShareDealCommand';
import { ShareDealId } from '../../../../domain/ShareDeal';
import { FoodCategory } from '../../../../domain/vo/FoodCategory';

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

  toCommand(userId: UserId): UpdateShareDealCommand {
    return new UpdateShareDealCommand(
      userId,
      ShareDealId(this.id),
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
