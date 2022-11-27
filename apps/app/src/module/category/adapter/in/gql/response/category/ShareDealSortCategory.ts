import { Field, ObjectType } from '@nestjs/graphql';

import { ShareDealSortType } from '../../../../../../share-deal/application/port/out/dto/ShareDealSortType';

@ObjectType()
export class ShareDealSortCategory {
  static readonly VALUES = Object.keys(ShareDealSortType).map((key) => {
    switch (key) {
      case ShareDealSortType.LATEST:
        return new ShareDealSortCategory(ShareDealSortType.LATEST, '등록순');
      case ShareDealSortType.POPULAR:
        return new ShareDealSortCategory(ShareDealSortType.POPULAR, '인원순');
      case ShareDealSortType.PARTICIPANTS:
        return new ShareDealSortCategory(
          ShareDealSortType.PARTICIPANTS,
          '입장가능순',
        );
      case ShareDealSortType.DISTANCE:
        return new ShareDealSortCategory(ShareDealSortType.DISTANCE, '거리순');
      default:
        throw new Error('unknown share deal sort type');
    }
  });

  @Field(() => ShareDealSortType)
  code: ShareDealSortType;

  @Field()
  name: string;

  constructor(code: ShareDealSortType, name: string) {
    this.code = code;
    this.name = name;
  }
}
