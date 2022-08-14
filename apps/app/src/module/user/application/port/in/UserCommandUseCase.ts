import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { TaskEither } from 'fp-ts/TaskEither';

import { SignInUserCommand } from './dto/SignInUserCommand';
import { SignInUserDto } from './dto/SignInUserDto';

export abstract class UserCommandUseCase {
  abstract signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, SignInUserDto>;
}
