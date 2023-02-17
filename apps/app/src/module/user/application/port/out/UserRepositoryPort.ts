import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { User } from '../../../domain/User';

export abstract class UserRepositoryPort {
  abstract save(user: User): TaskEither<DBError, User>;
}
