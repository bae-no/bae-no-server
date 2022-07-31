import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { AuthToken } from './AuthToken';
import { SignInUserCommand } from './SignInUserCommand';

export abstract class UserCommandUseCase {
  abstract signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, AuthToken>;
}
