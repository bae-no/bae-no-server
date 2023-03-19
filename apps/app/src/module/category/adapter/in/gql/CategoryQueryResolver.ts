import './registerEnum';

import { T } from '@app/custom/effect';
import { Query, Resolver } from '@nestjs/graphql';

import { CATEGORY_VALUES, CategoryResponse } from './response/CategoryResponse';
import { Public } from '../../../../user/adapter/in/gql/auth/Public';

@Resolver()
export class CategoryQueryResolver {
  @Public()
  @Query(() => CategoryResponse, { description: '카테고리 목록' })
  categories(): T.UIO<CategoryResponse> {
    return T.succeed(CATEGORY_VALUES);
  }
}
