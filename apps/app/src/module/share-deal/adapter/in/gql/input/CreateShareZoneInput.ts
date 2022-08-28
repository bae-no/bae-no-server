import { Field, InputType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

@InputType()
export class CreateShareZoneInput {
  @Field()
  addressRoad: string;

  @Field()
  addressDetail: string;

  @Field()
  @IsLatitude()
  latitude: number;

  @Field()
  @IsLongitude()
  longitude: number;
}
