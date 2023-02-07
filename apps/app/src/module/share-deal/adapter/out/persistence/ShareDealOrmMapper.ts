import { ShareDeal as OrmShareDeal } from '@prisma/client';

import { UserId } from '../../../../user/domain/User';
import { AddressSystem } from '../../../../user/domain/vo/AddressSystem';
import { ShareDeal } from '../../../domain/ShareDeal';
import { FoodCategory } from '../../../domain/vo/FoodCategory';
import { ParticipantInfo } from '../../../domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../domain/vo/ShareDealStatus';
import { ShareZone } from '../../../domain/vo/ShareZone';

export class ShareDealOrmMapper {
  static toDomain(orm: OrmShareDeal): ShareDeal {
    return new ShareDeal({
      category: FoodCategory[orm.category as FoodCategory],
      orderPrice: orm.orderPrice,
      ownerId: orm.ownerId as UserId,
      storeName: orm.storeName,
      thumbnail: orm.thumbnail,
      title: orm.title,
      status: ShareDealStatus[orm.status as ShareDealStatus],
      zone: new ShareZone(
        AddressSystem[orm.zone.system as AddressSystem],
        orm.zone.path,
        orm.zone.detail,
        orm.zone.coordinate.coordinates[1],
        orm.zone.coordinate.coordinates[0],
      ),
      participantInfo: ParticipantInfo.of(
        orm.participants.ids as UserId[],
        orm.participants.max,
      ),
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: ShareDeal): OrmShareDeal {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      category: domain.category,
      orderPrice: domain.orderPrice,
      ownerId: domain.ownerId,
      storeName: domain.storeName,
      thumbnail: domain.thumbnail,
      title: domain.title,
      zone: {
        system: domain.zone.system,
        path: domain.zone.path,
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
      participants: {
        ids: domain.participantInfo.ids,
        max: domain.participantInfo.max,
        current: domain.participantInfo.current,
        remaining: domain.participantInfo.remaining,
      },
    };
  }
}
