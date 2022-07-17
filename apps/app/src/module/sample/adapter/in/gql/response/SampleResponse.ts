import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Sample } from '../../../../domain/Sample';

@ObjectType()
export class SampleResponse {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  static of(sample: Sample) {
    const response = new SampleResponse();

    response.id = sample.id;
    response.name = sample.name;
    response.email = sample.email;

    return response;
  }
}
