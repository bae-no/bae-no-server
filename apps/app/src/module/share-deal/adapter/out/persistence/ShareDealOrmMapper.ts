import { ShareDeal as OrmShareDeal } from '@prisma/client';

import { ShareDeal } from '../../../domain/ShareDeal';
import { FoodCategory } from '../../../domain/vo/FoodCategory';
import { ShareZone } from '../../../domain/vo/ShareZone';

export class ShareDealOrmMapper {
  static toDomain(orm: OrmShareDeal): ShareDeal {
    return new ShareDeal({
      category: FoodCategory[orm.category as FoodCategory],
      minParticipants: orm.minParticipants,
      orderPrice: orm.orderPrice,
      ownerId: orm.ownerId,
      participantIds: orm.participantIds,
      storeName: orm.storeName,
      title: orm.title,
      zone: new ShareZone(
        orm.zone.road,
        orm.zone.detail,
        orm.zone.coordinate.latitude,
        orm.zone.coordinate.longitude,
      ),
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: ShareDeal): OrmShareDeal {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      category: domain.category,
      minParticipants: domain.minParticipants,
      orderPrice: domain.orderPrice,
      ownerId: domain.ownerId,
      participantIds: domain.participantIds,
      storeName: domain.storeName,
      title: domain.title,
      zone: domain.zone,
    };
  }
}
