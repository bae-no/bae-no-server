import { T } from '@app/custom/effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { UserId } from '../../../src/module/user/domain/User';
import { UpdateUserPushTokenCommand } from '../../../src/module/user-push-token/application/port/in/dto/UpdateUserPushTokenCommand';
import type { UserPushTokenQueryRepositoryPort } from '../../../src/module/user-push-token/application/port/out/UserPushTokenQueryRepositoryPort';
import type { UserPushTokenRepositoryPort } from '../../../src/module/user-push-token/application/port/out/UserPushTokenRepositoryPort';
import { UserPushTokenCommandService } from '../../../src/module/user-push-token/application/service/UserPushTokenCommandService';
import { UserPushToken } from '../../../src/module/user-push-token/domain/UserPushToken';
import { assertResolvesSuccess, expectNonNullable } from '../../fixture/utils';

describe('UserPushTokenCommandService', () => {
  const userPushTokenRepository = mock<UserPushTokenRepositoryPort>();
  const userPushTokenQueryRepository = mock<UserPushTokenQueryRepositoryPort>();
  const userPushTokenCommandService = new UserPushTokenCommandService(
    userPushTokenQueryRepository,
    userPushTokenRepository,
  );

  beforeEach(() => {
    mockReset(userPushTokenRepository);
    mockReset(userPushTokenQueryRepository);
  });

  describe('update', () => {
    it('기존 데이터가 없으면 새로운 토큰객체를 생성한다', async () => {
      // given
      const command = new UpdateUserPushTokenCommand(UserId('id'), 'token');

      let userPushToken: UserPushToken | null = null;
      userPushTokenQueryRepository.findByUserIds.mockReturnValue(T.succeed([]));
      userPushTokenRepository.save.mockImplementation((value) => {
        userPushToken = value;

        return T.succeed(value);
      });

      // when
      const result = userPushTokenCommandService.update(command);

      // then
      await assertResolvesSuccess(result);
      expectNonNullable(userPushToken);
    });

    it('이미 존재하는 데이터의 토큰을 갱신한다', async () => {
      // given
      const command = new UpdateUserPushTokenCommand(UserId('id'), 'newToken');
      const userPushToken = UserPushToken.create({
        userId: command.userId,
        token: 'oldToken',
      });

      userPushTokenQueryRepository.findByUserIds.mockReturnValue(
        T.succeed([userPushToken]),
      );
      userPushTokenRepository.save.mockImplementation((value) =>
        T.succeed(value),
      );

      // when
      const result = userPushTokenCommandService.update(command);

      // then
      await assertResolvesSuccess(result);
      expect(userPushToken.token).toBe(command.token);
    });
  });
});
