import { TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import { UserOrmMapper } from './UserOrmMapper';
import { UserRepositoryPort } from '../../../application/port/out/UserRepositoryPort';
import type { User } from '../../../domain/User';

@Repository()
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
