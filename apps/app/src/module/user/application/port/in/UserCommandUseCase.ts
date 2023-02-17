import type { AuthError } from '@app/domain/error/AuthError';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { AppendAddressCommand } from './dto/AppendAddressCommand';
import type { DeleteAddressCommand } from './dto/DeleteAddressCommand';
import type { EnrollUserCommand } from './dto/EnrollUserCommand';
import type { LeaveUserCommand } from './dto/LeaveUserCommand';
import type { SignInUserCommand } from './dto/SignInUserCommand';
import type { SignInUserDto } from './dto/SignInUserDto';
import type { UpdateProfileCommand } from './dto/UpdateProfileCommand';

export abstract class UserCommandUseCase {
  abstract signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, SignInUserDto>;

  abstract enroll(
    command: EnrollUserCommand,
  ): TaskEither<DBError | NotFoundException, void>;

  abstract leave(command: LeaveUserCommand): TaskEither<DBError, void>;

  abstract appendAddress(
    command: AppendAddressCommand,
  ): TaskEither<DBError, void>;

  abstract deleteAddress(
    command: DeleteAddressCommand,
  ): TaskEither<DBError, void>;

  abstract updateProfile(
    command: UpdateProfileCommand,
  ): TaskEither<DBError, void>;
}
