import { T, O, pipe, constVoid } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { AuthError } from '@app/domain/error/AuthError';
import type { DBError } from '@app/domain/error/DBError';
import type { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

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
  ): T.IO<DBError | AuthError, SignInUserDto> {
    return pipe(
      this.authProviderPort.findOne(command.code, command.type),
      T.chain((auth) =>
        T.structPar({
          auth: T.succeed(auth),
          user: this.userQueryRepositoryPort.findByAuth(auth),
        }),
      ),
      T.chain(({ auth, user }) => this.updateUser(user, auth)),
      T.map(
        (updatedUser) =>
          new SignInUserDto(
            this.tokenGeneratorPort.generateByUser(updatedUser),
            updatedUser,
          ),
      ),
    );
  }

  override enroll(
    command: EnrollUserCommand,
  ): T.IO<DBError | NotFoundException, void> {
    return pipe(
      this.userQueryRepositoryPort.findByIdE(command.userId),
      T.map((user) => user.enroll(command.nickname, command.toAddress())),
      T.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      T.map(constVoid),
    );
  }

  override leave(
    command: LeaveUserCommand,
    now = new Date(),
  ): T.IO<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findByIdE(command.userId),
      T.map((user) => user.leave(command.name, command.reason, now)),
      T.chain((user) => this.userRepositoryPort.save(user)),
      T.map(constVoid),
    );
  }

  override appendAddress(
    command: AppendAddressCommand,
  ): T.IO<DBError | IllegalStateException, void> {
    return pipe(
      this.userQueryRepositoryPort.findByIdE(command.userId),
      T.chain((user) =>
        T.fromEither(() => user.appendAddress(command.toAddress())),
      ),
      T.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      T.map(constVoid),
    );
  }

  override deleteAddress(command: DeleteAddressCommand): T.IO<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findByIdE(command.userId),
      T.map((user) => user.deleteAddress(command.key)),
      T.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      T.map(constVoid),
    );
  }

  override updateProfile(command: UpdateProfileCommand): T.IO<DBError, void> {
    return pipe(
      this.userQueryRepositoryPort.findByIdE(command.userId),
      T.map((user) => user.updateProfile(command.introduce)),
      T.chain((updatedUser) => this.userRepositoryPort.save(updatedUser)),
      T.map(constVoid),
    );
  }

  private updateUser(user: O.Option<User>, auth: Auth): T.IO<DBError, User> {
    return pipe(
      user,
      O.fold(
        () => this.userRepositoryPort.save(User.byAuth(auth)),
        (s) => T.succeed(s),
      ),
    );
  }
}
