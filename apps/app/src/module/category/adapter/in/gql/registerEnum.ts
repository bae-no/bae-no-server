import { registerEnumType } from '@nestjs/graphql';

import { FoodCategory } from '../../../../share-deal/domain/vo/FoodCategory';
import { AddressType } from '../../../../user/domain/vo/AddressType';
import { AuthType } from '../../../../user/domain/vo/AuthType';

registerEnumType(AuthType, { name: 'AuthType', description: '로그인 유형' });
registerEnumType(AddressType, {
  name: 'AddressType',
  description: '주소 유형',
});
registerEnumType(FoodCategory, {
  name: 'FoodCategory',
  description: '음식 유형',
});
