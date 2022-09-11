import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { none, some } from 'fp-ts/Option';
import { left, right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { AuthToken } from '../../../src/module/user/application/port/in/dto/AuthToken';
import { EnrollUserCommand } from '../../../src/module/user/application/port/in/dto/EnrollUserCommand';
import { LeaveUserCommand } from '../../../src/module/user/application/port/in/dto/LeaveUserCommand';
import { SignInUserCommand } from '../../../src/module/user/application/port/in/dto/SignInUserCommand';
import { AuthProviderPort } from '../../../src/module/user/application/port/out/AuthProviderPort';
import { TokenGeneratorPort } from '../../../src/module/user/application/port/out/TokenGeneratorPort';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../../../src/module/user/application/port/out/UserRepositoryPort';
import { UserCommandService } from '../../../src/module/user/application/service/UserCommandService';
import { User } from '../../../src/module/user/domain/User';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import {
  assertResolvesLeft,
  assertResolvesRight,
  expectNonNullable,
} from '../../fixture';

describe('UserCommandService', () => {
  const authQueryRepository = mock<AuthProviderPort>();
  const userQueryRepository = mock<UserQueryRepositoryPort>();
  const userRepository = mock<UserRepositoryPort>();
  const tokenGenerator = mock<TokenGeneratorPort>();
  const userCommandService = new UserCommandService(
    authQueryRepository,
    userQueryRepository,
    userRepository,
    tokenGenerator,
  );

  beforeEach(() => {
    mockReset(authQueryRepository);
    mockReset(userQueryRepository);
    mockReset(userRepository);
    mockReset(tokenGenerator);
  });

  describe('signIn', () => {
    it('새로운 유저를 생성하고 토큰을 발급한다', async () => {
      // given
      const command = new SignInUserCommand('code', AuthType.APPLE);
      const auth = new Auth('socialId', AuthType.APPLE);
      const user = User.byAuth(auth);
      const authToken = new AuthToken('token', new Date());

      authQueryRepository.findOne.mockReturnValue(right(auth));
      userQueryRepository.findByAuth.mockReturnValue(right(none));
      userRepository.save.mockReturnValue(right(user));
      tokenGenerator.generateByUser.mockReturnValue(authToken);

      // when
      const result = userCommandService.signIn(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.user).toStrictEqual(user);
        expect(value.authToken).toStrictEqual(authToken);
      });
    });

    it('이미 존재하는 유저를 통해 토큰을 발급한다', async () => {
      // given
      const command = new SignInUserCommand('code', AuthType.GOOGLE);
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      const authToken = new AuthToken('token', new Date());

      authQueryRepository.findOne.mockReturnValue(right(auth));
      userQueryRepository.findByAuth.mockReturnValue(right(some(user)));
      tokenGenerator.generateByUser.mockReturnValue(authToken);

      // when
      const result = userCommandService.signIn(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.user).toStrictEqual(user);
        expect(value.authToken).toStrictEqual(authToken);
      });
    });
  });

  describe('enroll', () => {
    it('사용자 등록에 성공한다', async () => {
      // given
      const command = new EnrollUserCommand(
        'userId',
        'nickname',
        10.2,
        20.3,
        AddressType.HOME,
        'road',
        'detail',
      );

      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      userQueryRepository.findById.mockReturnValue(right(user));
      userRepository.save.mockReturnValue(right(user));

      // when
      const result = userCommandService.enroll(command);

      // then
      await assertResolvesRight(result);
      expect(user.nickname).toBe(command.nickname);
      expect(user.addresses[0]).toStrictEqual(command.toAddress());
    });

    it('유저가 없으면 NotFoundException 을 반환한다', async () => {
      // given
      const command = new EnrollUserCommand(
        'userId',
        'nickname',
        10.2,
        20.3,
        AddressType.HOME,
        'road',
        'detail',
      );

      const exception = new NotFoundException('user not found');
      userQueryRepository.findById.mockReturnValue(left(exception));

      // when
      const result = userCommandService.enroll(command);

      // then
      await assertResolvesLeft(result, (err) => expect(err).toBe(exception));
    });
  });

  describe('leave', () => {
    it('회원탈퇴 처리한다', async () => {
      // given
      const now = new Date();
      const command = new LeaveUserCommand('userId', 'nickname', 'reason');

      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      userQueryRepository.findById.mockReturnValue(right(user));
      userRepository.save.mockReturnValue(right(user));

      // when
      const result = userCommandService.leave(command, now);

      // then
      await assertResolvesRight(result);
      expectNonNullable(user.leaveReason);
      expect(user.leaveReason.createdAt).toStrictEqual(now);
      expect(user.leaveReason.name).toBe(command.name);
      expect(user.leaveReason.reason).toBe(command.reason);
    });
  });
});
