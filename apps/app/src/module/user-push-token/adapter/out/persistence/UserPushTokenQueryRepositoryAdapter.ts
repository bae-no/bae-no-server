import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { pipe } from 'fp-ts/function';
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';
import { UserPushToken } from '../../../domain/UserPushToken';
import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';

export class UserPushTokenQueryRepositoryAdapter extends UserPushTokenQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findByUserIds(
    userIds: ReadonlyNonEmptyArray<string>,
  ): TaskEither<DBError, UserPushToken[]> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.userPushToken.findMany({
          where: { userId: { in: [...userIds] } },
        }),
      ),
      TE.map((userPushTokens) =>
        userPushTokens.map(UserPushTokenOrmMapper.toDomain),
      ),
    );
  }
}
