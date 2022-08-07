import { Query, Resolver } from '@nestjs/graphql';

import { CategoryResponse } from './response/CategoryResponse';

@Resolver()
export class CategoryQueryResolver {
  @Query(() => CategoryResponse, { description: '카테고리 목록' })
  categories(): CategoryResponse {
    return CategoryResponse.VALUES;
  }
}
