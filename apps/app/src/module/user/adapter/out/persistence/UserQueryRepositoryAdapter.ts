import { O, TE } from '@app/custom/fp-ts';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import type { User as OrmUser } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import { UserOrmMapper } from './UserOrmMapper';
import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import type { User, UserId } from '../../../domain/User';
import type { Auth } from '../../../domain/vo/Auth';

@Repository()
export class UserQueryRepositoryAdapter extends UserQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findByAuth(auth: Auth): TaskEither<DBError, Option<User>> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.user.findFirst({
          where: {
            auth: {
              socialId: auth.socialId,
              type: auth.type,
            },
          },
        }),
      ),
      TE.map(this.toOptionUser),
    );
  }

  override findById(id: UserId): TaskEither<DBError | NotFoundException, User> {
    return pipe(
      tryCatchDB(() => this.prisma.user.findUnique({ where: { id } })),
      TE.chainW((ormUser) =>
        ormUser
          ? TE.right(UserOrmMapper.toDomain(ormUser))
          : TE.left(
              new NotFoundException(`사용자가 존재하지 않습니다: id=${id}`),
            ),
      ),
    );
  }

  override findByNickname(nickname: string): TaskEither<DBError, Option<User>> {
    return pipe(
      tryCatchDB(() => this.prisma.user.findUnique({ where: { nickname } })),
      TE.map(this.toOptionUser),
    );
  }

  override findByIds(ids: UserId[]): TaskEither<DBError, User[]> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.user.findMany({ where: { id: { in: ids } } }),
      ),
      TE.map((ormUsers) => ormUsers.map(UserOrmMapper.toDomain)),
    );
  }

  private toOptionUser(ormUser: OrmUser | null): Option<User> {
    return pipe(
      O.fromNullable(ormUser),
      O.map((user) => UserOrmMapper.toDomain(user)),
    );
  }
}
