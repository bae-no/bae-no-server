import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { User, UserId } from '../../../domain/User';
import type { Auth } from '../../../domain/vo/Auth';

export abstract class UserQueryRepositoryPort {
  abstract findByAuth(auth: Auth): TaskEither<DBError, Option<User>>;

  abstract findById(id: UserId): TaskEither<DBError | NotFoundException, User>;

  abstract findByIds(ids: UserId[]): TaskEither<DBError, User[]>;

  abstract findByNickname(nickname: string): TaskEither<DBError, Option<User>>;
}
