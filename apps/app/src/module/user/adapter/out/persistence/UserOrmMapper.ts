import { User as OrmUser } from '@prisma/client';

import { User } from '../../../domain/User';
import { Address } from '../../../domain/vo/Address';
import { AddressType } from '../../../domain/vo/AddressType';
import { Agreement } from '../../../domain/vo/Agreement';
import { Auth } from '../../../domain/vo/Auth';
import { AuthType } from '../../../domain/vo/AuthType';
import { Profile } from '../../../domain/vo/Profile';

export class UserOrmMapper {
  static toDomain(orm: OrmUser): User {
    return new User({
      nickname: orm.nickname,
      auth: new Auth(orm.auth.socialId, AuthType[orm.auth.type as AuthType]),
      phoneNumber: orm.phoneNumber,
      agreement: new Agreement(
        orm.agreement.information,
        orm.agreement.service,
      ),
      profile: new Profile(orm.profile.uri, orm.profile.introduce),
      address: new Address(
        orm.address.alias,
        orm.address.road,
        orm.address.detail,
        AddressType[orm.address.type as keyof typeof AddressType],
        orm.address.coordinate.coordinates[1],
        orm.address.coordinate.coordinates[0],
      ),
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: User): OrmUser {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      nickname: domain.nickname,
      phoneNumber: domain.phoneNumber,
      auth: {
        socialId: domain.auth.socialId,
        type: domain.auth.type,
      },
      profile: {
        uri: domain.profile.uri,
        introduce: domain.profile.introduce,
      },
      agreement: {
        information: domain.agreement.information,
        service: domain.agreement.service,
      },
      address: {
        alias: domain.address.alias,
        road: domain.address.road,
        detail: domain.address.detail,
        type: domain.address.type,
        coordinate: {
          type: 'Point',
          coordinates: [
            domain.address.coordinate.longitude,
            domain.address.coordinate.latitude,
          ],
        },
      },
    };
  }
}
