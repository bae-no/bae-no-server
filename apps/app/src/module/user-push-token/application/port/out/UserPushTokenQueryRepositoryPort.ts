import { DBError } from '@app/domain/error/DBError';
import { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserPushToken } from '../../../domain/UserPushToken';

export abstract class UserPushTokenQueryRepositoryPort {
  abstract findByUserIds(
    userIds: ReadonlyNonEmptyArray<string>,
  ): TaskEither<DBError, UserPushToken[]>;
}
