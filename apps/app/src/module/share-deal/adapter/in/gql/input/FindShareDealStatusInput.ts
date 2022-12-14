import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FindShareDealStatusInput {
  @Field(() => ID)
  shareDealId: string;
}
