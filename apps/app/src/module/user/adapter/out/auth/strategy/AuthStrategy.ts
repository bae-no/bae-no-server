import type { AuthError } from '@app/domain/error/AuthError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { Auth } from '../../../../domain/vo/Auth';

export interface AuthStrategy {
  request(code: string): TaskEither<AuthError, Auth>;
}
