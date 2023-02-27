import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenRepositoryPort {
  abstract save(userPushToken: UserPushToken): T.IO<DBError, UserPushToken>;
}
