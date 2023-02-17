import type { DBError } from '@app/domain/error/DBError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenRepositoryPort {
  abstract save(
    userPushToken: UserPushToken,
  ): TaskEither<DBError, UserPushToken>;
}
