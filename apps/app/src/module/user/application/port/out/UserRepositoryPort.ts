import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { User } from '../../../domain/User';

export abstract class UserRepositoryPort {
  abstract save(user: User): TaskEither<DBError, User>;
}
