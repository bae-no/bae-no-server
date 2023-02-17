import type { User as OrmUser } from '@prisma/client';

import type { UserId } from '../../../domain/User';
import { User } from '../../../domain/User';
import { Address } from '../../../domain/vo/Address';
import { AddressSystem } from '../../../domain/vo/AddressSystem';
import { AddressType } from '../../../domain/vo/AddressType';
import { Agreement } from '../../../domain/vo/Agreement';
import { Auth } from '../../../domain/vo/Auth';
import { AuthType } from '../../../domain/vo/AuthType';
import { LeaveReason } from '../../../domain/vo/LeaveReason';
import { Profile } from '../../../domain/vo/Profile';
import { UserAddressList } from '../../../domain/vo/UserAddressList';

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
      addressList: UserAddressList.of(
        orm.addresses.map(
          (address) =>
            new Address(
              address.alias,
              AddressSystem[address.system as keyof typeof AddressSystem],
              address.path,
              address.detail,
              AddressType[address.type as keyof typeof AddressType],
              address.coordinate.coordinates[1],
              address.coordinate.coordinates[0],
            ),
        ),
      ),
      leaveReason: orm.leaveReason
        ? new LeaveReason(
            orm.leaveReason.createdAt,
            orm.leaveReason.name,
            orm.leaveReason.reason,
          )
        : null,
    }).setBase(orm.id as UserId, orm.createdAt, orm.updatedAt);
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
      addresses: domain.addresses.map((address) => ({
        alias: address.alias,
        system: address.system,
        path: address.path,
        detail: address.detail,
        type: address.type,
        coordinate: {
          type: 'Point',
          coordinates: [
            address.coordinate.longitude,
            address.coordinate.latitude,
          ],
        },
      })),
      leaveReason: domain.leaveReason
        ? {
            name: domain.leaveReason.name,
            reason: domain.leaveReason.reason,
            createdAt: domain.leaveReason.createdAt,
          }
        : null,
    };
  }
}
