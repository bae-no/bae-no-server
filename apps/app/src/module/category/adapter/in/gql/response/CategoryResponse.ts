import { Field, ObjectType } from '@nestjs/graphql';

import { AUTH_CATEGORY_VALUES, AuthCategory } from './category/AuthCategory';
import { FOOD_CATALOG_VALUES, FoodCatalog } from './category/FoodCatalog';
import {
  SHARED_DEAL_SORT_TYPE,
  ShareDealSortCategory,
} from './category/ShareDealSortCategory';

@ObjectType()
export class CategoryResponse {
  @Field(() => [AuthCategory])
  auth: AuthCategory[];

  @Field(() => [ShareDealSortCategory])
  shareDealSort: ShareDealSortCategory[];

  @Field(() => [FoodCatalog])
  foodCatalog: FoodCatalog[];

  constructor(
    auth: AuthCategory[],
    shareDealSort: ShareDealSortCategory[],
    foodCatalog: FoodCatalog[],
  ) {
    this.auth = auth;
    this.shareDealSort = shareDealSort;
    this.foodCatalog = foodCatalog;
  }
}

export const CATEGORY_VALUES = new CategoryResponse(
  AUTH_CATEGORY_VALUES,
  SHARED_DEAL_SORT_TYPE,
  FOOD_CATALOG_VALUES,
);
