import { T, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';

import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';
import type { UserPushToken } from '../../../domain/UserPushToken';

@Repository()
export class UserPushTokenQueryRepositoryAdapter extends UserPushTokenQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findByUserIds(userIds: string[]): T.IO<DBError, UserPushToken[]> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.userPushToken.findMany({
          where: { userId: { in: [...userIds] } },
        }),
      ),
      T.map((userPushTokens) =>
        userPushTokens.map(UserPushTokenOrmMapper.toDomain),
      ),
    );
  }
}
