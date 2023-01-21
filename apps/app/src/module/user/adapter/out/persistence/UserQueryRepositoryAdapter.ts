import { TE, O } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { User as OrmUser } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserOrmMapper } from './UserOrmMapper';
import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import { User } from '../../../domain/User';
import { Auth } from '../../../domain/vo/Auth';

@Injectable()
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

  override findById(id: string): TaskEither<DBError | NotFoundException, User> {
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

  override findByIds(ids: string[]): TaskEither<DBError, User[]> {
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
