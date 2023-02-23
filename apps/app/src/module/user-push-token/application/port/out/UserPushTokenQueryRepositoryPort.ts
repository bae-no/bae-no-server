import type { T } from '@app/custom/effect';
import type { DBError } from '@app/domain/error/DBError';

import type { UserId } from '../../../../user/domain/User';
import type { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenQueryRepositoryPort {
  abstract findByUserIds(userIds: UserId[]): T.IO<DBError, UserPushToken[]>;
}
