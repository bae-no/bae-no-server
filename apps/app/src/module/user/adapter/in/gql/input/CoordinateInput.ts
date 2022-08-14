import { Field, InputType } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

@InputType()
export class CoordinateInput {
  @Field()
  @IsLatitude()
  latitude: number;

  @Field()
  @IsLongitude()
  longitude: number;
}
