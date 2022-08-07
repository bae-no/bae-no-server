import './registerEnum';

import { Query, Resolver } from '@nestjs/graphql';

import { Public } from '../../../../user/adapter/in/gql/auth/Public';
import { CategoryResponse } from './response/CategoryResponse';

@Resolver()
export class CategoryQueryResolver {
  @Public()
  @Query(() => CategoryResponse, { description: '카테고리 목록' })
  categories(): CategoryResponse {
    return CategoryResponse.VALUES;
  }
}
