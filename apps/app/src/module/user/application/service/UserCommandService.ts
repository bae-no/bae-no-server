import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { AuthToken } from '../port/in/AuthToken';
import { SignInUserCommand } from '../port/in/SignInUserCommand';
import { UserCommandUseCase } from '../port/in/UserCommandUseCase';

export class UserCommandService extends UserCommandUseCase {
  constructor() {
    super();
  }

  override signIn(
    _command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, AuthToken> {
    throw new Error('Method not implemented.');
  }
}
