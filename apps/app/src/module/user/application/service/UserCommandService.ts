import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { O, TE } from '@app/external/fp-ts';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { User } from '../../domain/User';
import { Auth } from '../../domain/vo/Auth';
import { EnrollUserCommand } from '../port/in/dto/EnrollUserCommand';
import { SignInUserCommand } from '../port/in/dto/SignInUserCommand';
import { SignInUserDto } from '../port/in/dto/SignInUserDto';
import { UserCommandUseCase } from '../port/in/UserCommandUseCase';
import { AuthProviderPort } from '../port/out/AuthProviderPort';
import { TokenGeneratorPort } from '../port/out/TokenGeneratorPort';
import { UserQueryRepositoryPort } from '../port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../port/out/UserRepositoryPort';

@Injectable()
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

  override enroll(_: EnrollUserCommand): TE.TaskEither<DBError, void> {
    throw new Error('Method not implemented.');
  }
}
