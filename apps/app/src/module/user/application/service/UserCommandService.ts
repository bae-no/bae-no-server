import { AuthError } from '@app/domain/error/AuthError';
import { DBError } from '@app/domain/error/DBError';
import { O, TE } from '@app/domain/fp-ts';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../domain/Auth';
import { User } from '../../domain/User';
import { AuthToken } from '../port/in/AuthToken';
import { SignInUserCommand } from '../port/in/SignInUserCommand';
import { UserCommandUseCase } from '../port/in/UserCommandUseCase';
import { AuthQueryRepositoryPort } from '../port/out/AuthQueryRepositoryPort';
import { UserQueryRepositoryPort } from '../port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../port/out/UserRepositoryPort';

export class UserCommandService extends UserCommandUseCase {
  constructor(
    private readonly authQueryRepositoryPort: AuthQueryRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
    private readonly userRepositoryPort: UserRepositoryPort,
  ) {
    super();
  }

  override signIn(
    command: SignInUserCommand,
  ): TaskEither<DBError | AuthError, AuthToken> {
    return pipe(
      this.authQueryRepositoryPort.findOne(command.code, command.type),
      TE.bindTo('auth'),
      TE.bindW('user', ({ auth }) =>
        this.userQueryRepositoryPort.findByAuth(auth),
      ),
      TE.chainW(({ auth, user }) => this.updateUser(user, auth)),
      TE.map(() => new AuthToken()),
    );
  }

  private updateUser(
    user: Option<User>,
    auth: Auth,
  ): TaskEither<DBError, User> {
    return pipe(
      user,
      O.fold(
        () => this.userRepositoryPort.save(new User({ auth })),
        (s) => TE.right(s),
      ),
    );
  }
}
