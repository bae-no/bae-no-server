import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserRepositoryPort } from '../../../application/port/out/UserRepositoryPort';
import { User } from '../../../domain/User';
import { UserOrmMapper } from './UserOrmMapper';

export class UserRepositoryAdapter extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(user: User): TaskEither<DBError, User> {
    return pipe(
      UserOrmMapper.toOrm(user),
      ({ id, ...data }) =>
        tryCatchDB(() =>
          id
            ? this.prisma.user.update({ data, where: { id } })
            : this.prisma.user.create({ data }),
        ),
      TE.map(UserOrmMapper.toDomain),
    );
  }
}
