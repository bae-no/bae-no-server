import { UserPushToken as OrmUserPushToken } from '@prisma/client';

import { UserPushToken } from '../../../domain/UserPushToken';

export class UserPushTokenOrmMapper {
  static toDomain(orm: OrmUserPushToken): UserPushToken {
    return new UserPushToken({
      token: orm.token,
      userId: orm.userId,
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: UserPushToken): OrmUserPushToken {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      token: domain.token,
      userId: domain.userId,
    };
  }
}
