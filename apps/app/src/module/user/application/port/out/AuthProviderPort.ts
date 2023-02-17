import type { AuthError } from '@app/domain/error/AuthError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Auth } from '../../../domain/vo/Auth';
import type { AuthType } from '../../../domain/vo/AuthType';

export abstract class AuthProviderPort {
  abstract findOne(code: string, type: AuthType): TaskEither<AuthError, Auth>;
}
