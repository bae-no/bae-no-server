import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSampleInput {
  @Field()
  name: string;

  @Field()
  email: string;
}
