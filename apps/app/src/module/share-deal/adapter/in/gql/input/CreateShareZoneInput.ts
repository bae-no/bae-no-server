import { Field, InputType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

import { AddressSystem } from '../../../../../user/domain/vo/AddressSystem';

@InputType()
export class CreateShareZoneInput {
  @Field(() => AddressSystem)
  addressSystem: AddressSystem;

  @Field()
  addressPath: string;

  @Field()
  addressDetail: string;

  @Field()
  @IsLatitude()
  latitude: number;

  @Field()
  @IsLongitude()
  longitude: number;
}
