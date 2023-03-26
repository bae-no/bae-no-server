import { O, T } from '@app/custom/effect';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { AppendAddressCommand } from '../../../src/module/user/application/port/in/dto/AppendAddressCommand';
import { AuthToken } from '../../../src/module/user/application/port/in/dto/AuthToken';
import { DeleteAddressCommand } from '../../../src/module/user/application/port/in/dto/DeleteAddressCommand';
import { EnrollUserCommand } from '../../../src/module/user/application/port/in/dto/EnrollUserCommand';
import { LeaveUserCommand } from '../../../src/module/user/application/port/in/dto/LeaveUserCommand';
import { SignInUserCommand } from '../../../src/module/user/application/port/in/dto/SignInUserCommand';
import { UpdateProfileCommand } from '../../../src/module/user/application/port/in/dto/UpdateProfileCommand';
import type { AuthProviderPort } from '../../../src/module/user/application/port/out/AuthProviderPort';
import type { TokenGeneratorPort } from '../../../src/module/user/application/port/out/TokenGeneratorPort';
import type { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import type { UserRepositoryPort } from '../../../src/module/user/application/port/out/UserRepositoryPort';
import { UserCommandService } from '../../../src/module/user/application/service/UserCommandService';
import { User, UserId } from '../../../src/module/user/domain/User';
import { Address } from '../../../src/module/user/domain/vo/Address';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { UserAddressList } from '../../../src/module/user/domain/vo/UserAddressList';
import { UserFactory } from '../../fixture/UserFactory';
import {
  assertResolvesFail,
  assertResolvesSuccess,
  expectNonNullable,
} from '../../fixture/utils';

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

      authQueryRepository.findOne.mockReturnValue(T.succeed(auth));
      userQueryRepository.findByAuth.mockReturnValue(T.succeed(O.none));
      userRepository.save.mockReturnValue(T.succeed(user));
      tokenGenerator.generateByUser.mockReturnValue(authToken);

      // when
      const result = userCommandService.signIn(command);

      // then
      await assertResolvesSuccess(result, (value) => {
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

      authQueryRepository.findOne.mockReturnValue(T.succeed(auth));
      userQueryRepository.findByAuth.mockReturnValue(T.succeed(O.some(user)));
      tokenGenerator.generateByUser.mockReturnValue(authToken);

      // when
      const result = userCommandService.signIn(command);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.user).toStrictEqual(user);
        expect(value.authToken).toStrictEqual(authToken);
      });
    });
  });

  describe('enroll', () => {
    it('사용자 등록에 성공한다', async () => {
      // given
      const command = new EnrollUserCommand(
        UserId('userId'),
        'nickname',
        10.2,
        20.3,
        AddressType.HOME,
        AddressSystem.ROAD,
        'road',
        'detail',
      );

      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.enroll(command);

      // then
      await assertResolvesSuccess(result);
      expect(user.nickname).toBe(command.nickname);
      expect(user.addresses.find(0)).toStrictEqual(command.toAddress());
    });

    it('유저가 없으면 NotFoundException 을 반환한다', async () => {
      // given
      const command = new EnrollUserCommand(
        UserId('userId'),
        'nickname',
        10.2,
        20.3,
        AddressType.HOME,
        AddressSystem.JIBUN,
        'road',
        'detail',
      );

      const exception = new NotFoundException('user not found');
      userQueryRepository.findById.mockReturnValue(T.fail(exception));

      // when
      const result = userCommandService.enroll(command);

      // then
      await assertResolvesFail(result, (err) => expect(err).toBe(exception));
    });
  });

  describe('leave', () => {
    it('회원탈퇴 처리한다', async () => {
      // given
      const now = new Date();
      const command = new LeaveUserCommand(
        UserId('userId'),
        'nickname',
        'reason',
      );

      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.leave(command, now);

      // then
      await assertResolvesSuccess(result);
      expectNonNullable(user.leaveReason);
      expect(user.leaveReason.createdAt).toStrictEqual(now);
      expect(user.leaveReason.name).toBe(command.name);
      expect(user.leaveReason.reason).toBe(command.reason);
    });
  });

  describe('appendAddress', () => {
    it('주소가 6개 이상이면 에러가 발생한다', async () => {
      // given
      const command = new AppendAddressCommand(
        UserId('userId'),
        10,
        20,
        AddressType.HOME,
        AddressSystem.ROAD,
        'road',
        'detail',
      );

      const addresses = Array.from(
        { length: 6 },
        () =>
          new Address(
            'alias',
            AddressSystem.ROAD,
            'road',
            'detail',
            AddressType.HOME,
            1,
            2,
          ),
      );
      const user = UserFactory.create({
        addressList: UserAddressList.of(addresses),
      });

      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.appendAddress(command);

      // then
      await assertResolvesFail(result, (error) => {
        expect(error).toBeInstanceOf(IllegalStateException);
      });
    });

    it('주소등록에 성공한다', async () => {
      // given
      const command = new AppendAddressCommand(
        UserId('userId'),
        10,
        20,
        AddressType.HOME,
        AddressSystem.ROAD,
        'road',
        'detail',
      );
      const user = UserFactory.create();

      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.appendAddress(command);

      // then
      await assertResolvesSuccess(result);
      expect(user.addresses.count).toBe(1);
      expect(user.addresses.find(0)).toStrictEqual(command.toAddress());
    });
  });

  describe('deleteAddress', () => {
    it('주어진 주소를 삭제한다', async () => {
      // given
      const command = new DeleteAddressCommand('1', UserId('userId'));

      const user = UserFactory.create({
        addressList: UserAddressList.of([
          new Address(
            'alias1',
            AddressSystem.ROAD,
            'road1',
            'detail1',
            AddressType.HOME,
            1,
            2,
          ),
          new Address(
            'alias2',
            AddressSystem.ROAD,
            'road2',
            'detail2',
            AddressType.HOME,
            1,
            2,
          ),
          new Address(
            'alias3',
            AddressSystem.ROAD,
            'road3',
            'detail3',
            AddressType.HOME,
            1,
            2,
          ),
        ]),
      });
      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.deleteAddress(command);

      // then
      await assertResolvesSuccess(result);
      expect(user.addresses.count).toBe(2);
      expect(user.addresses.find(0)?.alias).toBe('alias1');
      expect(user.addresses.find(1)?.alias).toBe('alias3');
    });
  });

  describe('updateProfile', () => {
    it('프로필 정보를 수정한다.', async () => {
      // given
      const command = new UpdateProfileCommand(UserId('userId'), 'introduce');
      const user = UserFactory.create();

      userQueryRepository.findById.mockReturnValue(T.succeed(user));
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = userCommandService.updateProfile(command);

      // then
      await assertResolvesSuccess(result);
      expect(user.profile.introduce).toBe(command.introduce);
    });
  });
});
