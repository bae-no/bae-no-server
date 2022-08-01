import { AuthError } from '@app/domain/error/AuthError';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../domain/Auth';
import { AuthType } from '../../../domain/AuthType';

export abstract class AuthQueryRepositoryPort {
  abstract findOne(code: string, type: AuthType): TaskEither<AuthError, Auth>;
}
