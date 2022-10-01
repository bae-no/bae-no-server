import { faker } from '@faker-js/faker';

import {
  ShareDeal,
  ShareDealProps,
} from '../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../src/module/share-deal/domain/vo/FoodCategory';
import { ParticipantInfo } from '../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../src/module/share-deal/domain/vo/ShareDealStatus';
import { ShareZone } from '../../src/module/share-deal/domain/vo/ShareZone';

type BaseType = {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  participants?: ParticipantInfo;
};

export class ShareDealFactory {
  static create(props: Partial<ShareDealProps & BaseType> = {}): ShareDeal {
    const shareZone = new ShareZone(
      faker.address.streetAddress(true),
      faker.address.buildingNumber(),
      +faker.address.latitude(undefined, 0),
      +faker.address.longitude(undefined, 0),
    );
    const ownerId = props.ownerId ?? faker.database.mongodbObjectId();

    return new ShareDeal({
      title: faker.word.noun(3),
      status: faker.helpers.arrayElement(Object.values(ShareDealStatus)),
      category: faker.helpers.arrayElement(Object.values(FoodCategory)),
      participantInfo:
        props.participantInfo ??
        ParticipantInfo.of([ownerId], faker.datatype.number()),
      orderPrice: faker.datatype.number(),
      ownerId,
      storeName: faker.word.noun(),
      thumbnail: faker.image.imageUrl(),
      zone: shareZone,
      ...props,
    }).setBase(
      props.id ?? faker.database.mongodbObjectId(),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  static createOpen(
    props: Partial<Omit<ShareDealProps, 'status'> & BaseType> = {},
  ): ShareDeal {
    return ShareDealFactory.create({ ...props, status: ShareDealStatus.OPEN });
  }
}
