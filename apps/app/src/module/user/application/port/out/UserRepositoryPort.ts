import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { User } from '../../../domain/User';

export abstract class UserRepositoryPort {
  abstract save(user: User): T.IO<DBError, User>;
}
