import { T, O, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import type { User as OrmUser } from '@prisma/client';

import { UserOrmMapper } from './UserOrmMapper';
import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import type { User, UserId } from '../../../domain/User';
import type { Auth } from '../../../domain/vo/Auth';

@Repository()
export class UserQueryRepositoryAdapter extends UserQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override findByAuth(auth: Auth): T.IO<DBError, O.Option<User>> {
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
      T.map(this.toOptionUser),
    );
  }

  override findById(id: UserId): T.IO<DBError | NotFoundException, User> {
    return pipe(
      tryCatchDB(() => this.prisma.user.findUnique({ where: { id } })),
      T.chain((ormUser) =>
        ormUser
          ? T.succeed(UserOrmMapper.toDomain(ormUser))
          : T.fail(
              new NotFoundException(`사용자가 존재하지 않습니다: id=${id}`),
            ),
      ),
    );
  }

  override findByNickname(nickname: string): T.IO<DBError, O.Option<User>> {
    return pipe(
      tryCatchDB(() => this.prisma.user.findUnique({ where: { nickname } })),
      T.map(this.toOptionUser),
    );
  }

  override findByIds(ids: UserId[]): T.IO<DBError, User[]> {
    return pipe(
      tryCatchDB(async () =>
        this.prisma.user.findMany({ where: { id: { in: ids } } }),
      ),
      T.map((ormUsers) => ormUsers.map(UserOrmMapper.toDomain)),
    );
  }

  private toOptionUser(ormUser: OrmUser | null): O.Option<User> {
    return pipe(
      O.fromNullable(ormUser),
      O.map((user) => UserOrmMapper.toDomain(user)),
    );
  }
}
