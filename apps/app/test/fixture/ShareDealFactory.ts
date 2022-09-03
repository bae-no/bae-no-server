import { faker } from '@faker-js/faker';

import {
  ShareDeal,
  ShareDealProps,
} from '../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../src/module/share-deal/domain/vo/FoodCategory';
import { ShareDealStatus } from '../../src/module/share-deal/domain/vo/ShareDealStatus';
import { ShareZone } from '../../src/module/share-deal/domain/vo/ShareZone';

type BaseType = {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class ShareDealFactory {
  static create(props: Partial<ShareDealProps & BaseType> = {}): ShareDeal {
    const shareZone = new ShareZone(
      faker.address.streetAddress(true),
      faker.address.buildingNumber(),
      +faker.address.latitude(undefined, 0),
      +faker.address.longitude(undefined, 0),
    );

    return new ShareDeal({
      title: faker.word.noun(3),
      status: faker.helpers.arrayElement(Object.values(ShareDealStatus)),
      category: faker.helpers.arrayElement(Object.values(FoodCategory)),
      participantIds: [faker.database.mongodbObjectId()],
      minParticipants: faker.datatype.number(),
      orderPrice: faker.datatype.number(),
      ownerId: faker.database.mongodbObjectId(),
      storeName: faker.word.noun(),
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
