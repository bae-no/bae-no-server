import { Field, ObjectType } from '@nestjs/graphql';

import { AuthCategory } from './category/AuthCategory';

@ObjectType()
export class CategoryResponse {
  @Field(() => [AuthCategory])
  auth: AuthCategory[];

  constructor(auth: AuthCategory[]) {
    this.auth = auth;
  }

  static readonly VALUES = new CategoryResponse(AuthCategory.VALUES);
}
