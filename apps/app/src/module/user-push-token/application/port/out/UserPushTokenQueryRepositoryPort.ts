import type { DBError } from '@app/domain/error/DBError';
import type { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenQueryRepositoryPort {
  abstract findByUserIds(
    userIds: ReadonlyNonEmptyArray<string>,
  ): TaskEither<DBError, UserPushToken[]>;
}
