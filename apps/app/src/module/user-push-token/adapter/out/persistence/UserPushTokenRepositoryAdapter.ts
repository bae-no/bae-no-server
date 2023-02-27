import { T, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDBE } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';

import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';
import { UserPushTokenRepositoryPort } from '../../../application/port/out/UserPushTokenRepositoryPort';
import type { UserPushToken } from '../../../domain/UserPushToken';

@Repository()
export class UserPushTokenRepositoryAdapter extends UserPushTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(userPushToken: UserPushToken): T.IO<DBError, UserPushToken> {
    return pipe(
      UserPushTokenOrmMapper.toOrm(userPushToken),
      ({ id, ...data }) =>
        tryCatchDBE(() =>
          id
            ? this.prisma.userPushToken.update({ data, where: { id } })
            : this.prisma.userPushToken.create({ data }),
        ),
      T.map(UserPushTokenOrmMapper.toDomain),
    );
  }
}
