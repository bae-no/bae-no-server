import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserRepositoryPort } from '../../../application/port/out/UserRepositoryPort';
import { User } from '../../../domain/User';
import { UserOrmMapper } from './UserOrmMapper';

@Injectable()
export class UserRepositoryAdapter extends UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(user: User): TaskEither<DBError, User> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.user.create({ data: UserOrmMapper.toOrm(user) }),
      ),
      TE.map(UserOrmMapper.toDomain),
    );
  }
}
