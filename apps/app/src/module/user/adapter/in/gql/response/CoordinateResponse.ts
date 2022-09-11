import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoordinateResponse {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
