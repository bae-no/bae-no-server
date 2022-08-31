import { registerEnumType } from '@nestjs/graphql';

import { ShareDealSortType } from '../../../../share-deal/application/port/out/dto/ShareDealSortType';
import { FoodCategory } from '../../../../share-deal/domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../../share-deal/domain/vo/ShareDealStatus';
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
registerEnumType(ShareDealStatus, {
  name: 'ShareDealStatus',
  description: '공유딜 상태',
});
registerEnumType(ShareDealSortType, {
  name: 'ShareDealSortType',
  description: '공유딜 정렬유형',
});
