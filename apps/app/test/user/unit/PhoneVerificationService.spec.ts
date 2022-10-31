import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { SmsPort } from '@app/domain/notification/SmsPort';
import { left, right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { SendPhoneVerificationCodeCommand } from '../../../src/module/user/application/port/in/dto/SendPhoneVerificationCodeCommand';
import { VerifyPhoneVerificationCodeCommand } from '../../../src/module/user/application/port/in/dto/VerifyPhoneVerificationCodeCommand';
import { PhoneVerificationRepositoryPort } from '../../../src/module/user/application/port/out/PhoneVerificationRepositoryPort';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from '../../../src/module/user/application/port/out/UserRepositoryPort';
import { PhoneVerificationService } from '../../../src/module/user/application/service/PhoneVerificationService';
import { MismatchedCodeException } from '../../../src/module/user/domain/exception/MismatchedCodeException';
import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';

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
      const command = new SendPhoneVerificationCodeCommand('id', '01011112222');

      phoneVerificationRepository.save.mockReturnValue(
        right(PhoneVerification.of(command.phoneNumber)),
      );
      smsPort.send.mockReturnValue(right(undefined));

      // when
      const result = phoneVerificationService.sendCode(command);

      // then
      await assertResolvesRight(result);
    });
  });

  describe('verify', () => {
    it('인증번호가 없으면 에러를 반환한다', async () => {
      // given
      const command = new VerifyPhoneVerificationCodeCommand('id', '1234');

      const notFoundException = new NotFoundException('');
      phoneVerificationRepository.findLatest.mockReturnValue(
        left(notFoundException),
      );

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err).toBe(notFoundException);
      });
    });

    it('인증번호 검증에 실패하면 에러를 반환한다', async () => {
      // given
      const phoneVerification = PhoneVerification.of('01011112222', '1234');
      const command = new VerifyPhoneVerificationCodeCommand('id', '1245');
      const user = User.byAuth(new Auth('id', AuthType.GOOGLE));

      userQueryRepository.findById.mockReturnValue(right(user));
      phoneVerificationRepository.findLatest.mockReturnValue(
        right(phoneVerification),
      );

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err).toBeInstanceOf(MismatchedCodeException);
      });
    });

    it('인증번호 검증에 성공하면 전화번호를 갱신한다', async () => {
      // given
      const phoneVerification = PhoneVerification.of('01011112222', '1234');
      const command = new VerifyPhoneVerificationCodeCommand(
        'id',
        phoneVerification.code,
      );
      const user = User.byAuth(new Auth('id', AuthType.GOOGLE));

      userQueryRepository.findById.mockReturnValue(right(user));
      phoneVerificationRepository.findLatest.mockReturnValue(
        right(phoneVerification),
      );
      userRepository.save.mockReturnValue(right(user));

      // when
      const result = phoneVerificationService.verify(command);

      // then
      await assertResolvesRight(result);
      expect(user.phoneNumber).toBe(phoneVerification.phoneNumber);
    });
  });
});
