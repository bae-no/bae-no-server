import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TE, O } from '@app/external/fp-ts';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { User as OrmUser } from '@prisma/client';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserQueryRepositoryPort } from '../../../application/port/out/UserQueryRepositoryPort';
import { User } from '../../../domain/User';
import { Auth } from '../../../domain/vo/Auth';
import { UserOrmMapper } from './UserOrmMapper';

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

  private toOptionUser(ormUser: OrmUser | null): Option<User> {
    return pipe(
      O.fromNullable(ormUser),
      O.map((user) => UserOrmMapper.toDomain(user)),
    );
  }
}
