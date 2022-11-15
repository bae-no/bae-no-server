import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenRepositoryPort {
  abstract save(
    userPushToken: UserPushToken,
  ): TaskEither<DBError, UserPushToken>;
}
