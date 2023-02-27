import { T, pipe, constVoid } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';

import { UserPushToken } from '../../domain/UserPushToken';
import type { UpdateUserPushTokenCommand } from '../port/in/dto/UpdateUserPushTokenCommand';
import { UserPushTokenCommandUseCase } from '../port/in/UserPushTokenCommandUseCase';
import { UserPushTokenQueryRepositoryPort } from '../port/out/UserPushTokenQueryRepositoryPort';
import { UserPushTokenRepositoryPort } from '../port/out/UserPushTokenRepositoryPort';

@Service()
export class UserPushTokenCommandService extends UserPushTokenCommandUseCase {
  constructor(
    private readonly userPushTokenQueryRepositoryPort: UserPushTokenQueryRepositoryPort,
    private readonly userPushTokenRepositoryPort: UserPushTokenRepositoryPort,
  ) {
    super();
  }

  update(command: UpdateUserPushTokenCommand): T.IO<DBError, void> {
    return pipe(
      this.userPushTokenQueryRepositoryPort.findByUserIds([command.userId]),
      T.map((userPushTokens) => userPushTokens[0]),
      T.map(
        (userPushToken) =>
          userPushToken?.update(command.token) ??
          UserPushToken.create({
            userId: command.userId,
            token: command.token,
          }),
      ),
      T.chain((userPushToken) =>
        this.userPushTokenRepositoryPort.save(userPushToken),
      ),
      T.map(constVoid),
    );
  }
}
