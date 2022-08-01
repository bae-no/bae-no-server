import { DBError } from '@app/domain/error/DBError';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../domain/Auth';
import { User } from '../../../domain/User';

export abstract class UserQueryRepositoryPort {
  abstract findByAuth(auth: Auth): TaskEither<DBError, Option<User>>;
}
