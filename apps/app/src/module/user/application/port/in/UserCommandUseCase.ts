import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { EnrollUserCommand } from './dto/EnrollUserCommand';
import { LeaveUserCommand } from './dto/LeaveUserCommand';
import { SignInUserCommand } from './dto/SignInUserCommand';
import { SignInUserDto } from './dto/SignInUserDto';

export abstract class UserCommandUseCase {
  abstract signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, SignInUserDto>;

  abstract enroll(
    command: EnrollUserCommand,
  ): TaskEither<DBError | NotFoundException, void>;

  abstract leave(command: LeaveUserCommand): TaskEither<DBError, void>;
}
