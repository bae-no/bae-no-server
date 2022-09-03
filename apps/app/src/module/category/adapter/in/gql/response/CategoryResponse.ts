import { Field, ObjectType } from '@nestjs/graphql';

import { AuthCategory } from './category/AuthCategory';
import { ShareDealSortCategory } from './category/ShareDealSortCategory';

@ObjectType()
export class CategoryResponse {
  static readonly VALUES = new CategoryResponse(
    AuthCategory.VALUES,
    ShareDealSortCategory.VALUES,
  );

  @Field(() => [AuthCategory])
  auth: AuthCategory[];

  @Field(() => [ShareDealSortCategory])
  shareDealSort: ShareDealSortCategory[];

  constructor(auth: AuthCategory[], shareDealSort: ShareDealSortCategory[]) {
    this.auth = auth;
    this.shareDealSort = shareDealSort;
  }
}
