import { ShareDeal as OrmShareDeal } from '@prisma/client';

import { ShareDeal } from '../../../domain/ShareDeal';
import { FoodCategory } from '../../../domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
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
      thumbnail: orm.thumbnail,
      title: orm.title,
      status: ShareDealStatus[orm.status as ShareDealStatus],
      zone: new ShareZone(
        orm.zone.road,
        orm.zone.detail,
        orm.zone.coordinate.coordinates[1],
        orm.zone.coordinate.coordinates[0],
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
      thumbnail: domain.thumbnail,
      title: domain.title,
      zone: {
        road: domain.zone.road,
        detail: domain.zone.detail,
        coordinate: {
          type: 'Point',
          coordinates: [
            domain.zone.coordinate.longitude,
            domain.zone.coordinate.latitude,
          ],
        },
      },
      status: domain.status,
    };
  }
}
