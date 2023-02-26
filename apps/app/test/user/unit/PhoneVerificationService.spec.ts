import { T } from '@app/custom/effect';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { SmsPort } from '@app/domain/notification/SmsPort';
import { mock, mockReset } from 'jest-mock-extended';

import { SendPhoneVerificationCodeCommand } from '../../../src/module/user/application/port/in/dto/SendPhoneVerificationCodeCommand';
import { VerifyPhoneVerificationCodeCommand } from '../../../src/module/user/application/port/in/dto/VerifyPhoneVerificationCodeCommand';
import type { PhoneVerificationRepositoryPort } from '../../../src/module/user/application/port/out/PhoneVerificationRepositoryPort';
import type { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import type { UserRepositoryPort } from '../../../src/module/user/application/port/out/UserRepositoryPort';
import { PhoneVerificationService } from '../../../src/module/user/application/service/PhoneVerificationService';
import { MismatchedCodeException } from '../../../src/module/user/domain/exception/MismatchedCodeException';
import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { User, UserId } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('PhoneVerificationService', () => {
  const phoneVerificationRepository = mock<PhoneVerificationRepositoryPort>();
  const userQueryRepository = mock<UserQueryRepositoryPort>();
  const userRepository = mock<UserRepositoryPort>();
  const smsPort = mock<SmsPort>();
  const phoneVerificationService = new PhoneVerificationService(
    phoneVerificationRepository,
    userQueryRepository,
    userRepository,
    smsPort,
  );

  beforeEach(() => {
    mockReset(phoneVerificationRepository);
    mockReset(smsPort);
  });

  describe('sendCode', () => {
    it('전화번호 인증코드를 전송한다', async () => {
      // given
      const command = new SendPhoneVerificationCodeCommand(
        UserId('id'),
        '01011112222',
      );

      phoneVerificationRepository.save.mockReturnValue(
        T.succeed(PhoneVerification.of(command.phoneNumber)),
      );
      smsPort.send.mockReturnValue(T.unit);

      // when
      const result = phoneVerificationService.sendCode(command);

      // then
      await assertResolvesSuccess(result);
    });
  });

  describe('verify', () => {
    it('인증번호가 없으면 에러를 반환한다', async () => {
      // given
      const command = new VerifyPhoneVerificationCodeCommand(
        UserId('id'),
        '1234',
      );

      const user = User.byAuth(new Auth('id', AuthType.GOOGLE));
      userQueryRepository.findByIdE.mockReturnValue(T.succeed(user));
      const notFoundException = new NotFoundException('');
      phoneVerificationRepository.findLatest.mockReturnValue(
        T.fail(notFoundException),
      );

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesFail(result, (err) => {
        expect(err).toBe(notFoundException);
      });
    });

    it('인증번호 검증에 실패하면 에러를 반환한다', async () => {
      // given
      const phoneVerification = PhoneVerification.of('01011112222', '1234');
      const command = new VerifyPhoneVerificationCodeCommand(
        UserId('id'),
        '1245',
      );
      const user = User.byAuth(new Auth('id', AuthType.GOOGLE));

      userQueryRepository.findByIdE.mockReturnValue(T.succeed(user));
      phoneVerificationRepository.findLatest.mockReturnValue(
        T.succeed(phoneVerification),
      );

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesFail(result, (err) => {
        expect(err).toBeInstanceOf(MismatchedCodeException);
      });
    });

    it('인증번호 검증에 성공하면 전화번호를 갱신한다', async () => {
      // given
      const phoneVerification = PhoneVerification.of('01011112222', '1234');
      const command = new VerifyPhoneVerificationCodeCommand(
        UserId('id'),
        phoneVerification.code,
      );
      const user = User.byAuth(new Auth('id', AuthType.GOOGLE));

      userQueryRepository.findByIdE.mockReturnValue(T.succeed(user));
      phoneVerificationRepository.findLatest.mockReturnValue(
        T.succeed(phoneVerification),
      );
      userRepository.save.mockReturnValue(T.succeed(user));

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesSuccess(result);
      expect(user.phoneNumber).toBe(phoneVerification.phoneNumber);
    });
  });
});
