import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { TE, O } from '@app/external/fp-ts';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
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

  findByAuth(auth: Auth): TaskEither<DBError, Option<User>> {
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
      TE.map((ormUser) =>
        pipe(
          O.fromNullable(ormUser),
          O.map((user) => UserOrmMapper.toDomain(user)),
        ),
      ),
    );
  }
}
