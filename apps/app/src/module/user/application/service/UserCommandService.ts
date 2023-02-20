import { O, TE } from '@app/custom/fp-ts';
import { Service } from '@app/custom/nest/decorator/Service';
import type { AuthError } from '@app/domain/error/AuthError';
import type { DBError } from '@app/domain/error/DBError';
import type { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import { constVoid, pipe } from 'fp-ts/function';
import type { Option } from 'fp-ts/Option';
import type { TaskEither } from 'fp-ts/TaskEither';

import { User } from '../../domain/User';
import type { Auth } from '../../domain/vo/Auth';
import type { AppendAddressCommand } from '../port/in/dto/AppendAddressCommand';
import type { DeleteAddressCommand } from '../port/in/dto/DeleteAddressCommand';
import type { EnrollUserCommand } from '../port/in/dto/EnrollUserCommand';
import type { LeaveUserCommand } from '../port/in/dto/LeaveUserCommand';
import type { SignInUserCommand } from '../port/in/dto/SignInUserCommand';
import { SignInUserDto } from '../port/in/dto/SignInUserDto';
import type { UpdateProfileCommand } from '../port/in/dto/UpdateProfileCommand';
import { UserCommandUseCase } from '../port/in/UserCommandUseCase';
import { AuthProviderPort } from '../port/out/AuthProviderPort';
import { TokenGeneratorPort } from '../port/out/TokenGeneratorPort';
import { UserQueryRepositoryPort } from '../port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../port/out/UserRepositoryPort';

@Service()
export class UserCommandService extends UserCommandUseCase {
  constructor(
    private readonly authProviderPort: AuthProviderPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly tokenGeneratorPort: TokenGeneratorPort,
  ) {
    super();
  }

  override signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, SignInUserDto> {
    return pipe(
      TE.Do,
      TE.apS('auth', this.authProviderPort.findOne(command.code, command.type)),
      TE.bindW('user', ({ auth }) =>
        this.userQueryRepositoryPort.findByAuth(auth),
      ),
      TE.bindW('updatedUser', ({ auth, user }) => this.updateUser(user, auth)),
      TE.map(
        ({ updatedUser }) =>
          new SignInUserDto(
            this.tokenGeneratorPort.generateByUser(updatedUser),
            updatedUser,
          ),
      ),
    );
  }

  override enroll(
    command: EnrollUserCommand,
  ): TaskEither<DBError | NotFoundException, void> {
    return pipe(
      this.userQueryRepositoryPort.findById(command.userId),
      TE.map((user) => user.enroll(command.nickname, command.toAddress())),
      TE.chainW((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      TE.map(constVoid),
    );
  }

  override leave(
    command: LeaveUserCommand,
    now = new Date(),
  ): TaskEither<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findById(command.userId),
      TE.map((user) => user.leave(command.name, command.reason, now)),
      TE.chain((user) => this.userRepositoryPort.save(user)),
      TE.map(constVoid),
    );
  }

  override appendAddress(
    command: AppendAddressCommand,
  ): TaskEither<DBError | IllegalStateException, void> {
    return pipe(
      this.userQueryRepositoryPort.findById(command.userId),
      TE.chainEitherKW((user) => user.appendAddress(command.toAddress())),
      TE.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      TE.map(constVoid),
    );
  }

  override deleteAddress(
    command: DeleteAddressCommand,
  ): TaskEither<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findById(command.userId),
      TE.map((user) => user.deleteAddress(command.key)),
      TE.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      TE.map(constVoid),
    );
  }

  override updateProfile(
    command: UpdateProfileCommand,
  ): TE.TaskEither<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findById(command.userId),
      TE.map((user) => user.updateProfile(command.introduce)),
      TE.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      TE.map(constVoid),
    );
  }

  private updateUser(
    user: Option<User>,
    auth: Auth,
  ): TaskEither<DBError, User> {
    return pipe(
      user,
      O.fold(
        () => this.userRepositoryPort.save(User.byAuth(auth)),
        (s) => TE.right(s),
      ),
    );
  }
}
