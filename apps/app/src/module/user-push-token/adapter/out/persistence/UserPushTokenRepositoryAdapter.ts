import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserPushTokenRepositoryPort } from '../../../application/port/out/UserPushTokenRepositoryPort';
import { UserPushToken } from '../../../domain/UserPushToken';
import { UserPushTokenOrmMapper } from './UserPushTokenOrmMapper';

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
