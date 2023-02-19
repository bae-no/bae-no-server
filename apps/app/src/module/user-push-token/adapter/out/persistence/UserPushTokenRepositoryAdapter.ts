import { TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';
import { UserPushTokenRepositoryPort } from '../../../application/port/out/UserPushTokenRepositoryPort';
import type { UserPushToken } from '../../../domain/UserPushToken';

@Repository()
export class UserPushTokenRepositoryAdapter extends UserPushTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(
    userPushToken: UserPushToken,
  ): TaskEither<DBError, UserPushToken> {
    return pipe(
      UserPushTokenOrmMapper.toOrm(userPushToken),
      ({ id, ...data }) =>
        tryCatchDB(() =>
          id
            ? this.prisma.userPushToken.update({ data, where: { id } })
            : this.prisma.userPushToken.create({ data }),
        ),
      TE.map(UserPushTokenOrmMapper.toDomain),
    );
  }
}
