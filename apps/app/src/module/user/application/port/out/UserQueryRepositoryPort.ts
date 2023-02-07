import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { User, UserId } from '../../../domain/User';
import { Auth } from '../../../domain/vo/Auth';

export abstract class UserQueryRepositoryPort {
  abstract findByAuth(auth: Auth): TaskEither<DBError, Option<User>>;

  abstract findById(id: UserId): TaskEither<DBError | NotFoundException, User>;

  abstract findByIds(ids: UserId[]): TaskEither<DBError, User[]>;

  abstract findByNickname(nickname: string): TaskEither<DBError, Option<User>>;
}
