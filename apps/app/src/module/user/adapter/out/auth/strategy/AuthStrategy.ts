import { AuthError } from '@app/domain/error/AuthError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/vo/Auth';

export interface AuthStrategy {
  request(code: string): TaskEither<AuthError, Auth>;
}
