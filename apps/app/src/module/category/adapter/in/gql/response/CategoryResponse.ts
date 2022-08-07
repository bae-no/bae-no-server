import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { AuthType } from '../../../../../user/domain/vo/AuthType';
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

registerEnumType(AuthType, { name: 'AuthType', description: '로그인 유형' });
