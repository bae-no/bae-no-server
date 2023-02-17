import { TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import type { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';
import type { TaskEither } from 'fp-ts/TaskEither';

import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';
import { UserPushTokenQueryRepositoryPort } from '../../../application/port/out/UserPushTokenQueryRepositoryPort';
import type { UserPushToken } from '../../../domain/UserPushToken';

@Injectable()
export class UserPushTokenQueryRepositoryAdapter extends UserPushTokenQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findByUserIds(
    userIds: ReadonlyNonEmptyArray<string>,
  ): TaskEither<DBError, UserPushToken[]> {
    return pipe(
      tryCatchDB(async () =>
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
