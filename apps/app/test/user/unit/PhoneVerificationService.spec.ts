import { SmsPort } from '@app/domain/notification/SmsPort';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { SendPhoneVerificationCodeCommand } from '../../../src/module/user/application/port/in/SendPhoneVerificationCodeCommand';
import { PhoneVerificationRepositoryPort } from '../../../src/module/user/application/port/out/PhoneVerificationRepositoryPort';
import { PhoneVerificationService } from '../../../src/module/user/application/service/PhoneVerificationService';
import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { assertResolvesRight } from '../../fixture';

describe('PhoneVerificationService', () => {
  const phoneVerificationRepository = mock<PhoneVerificationRepositoryPort>();
  const smsPort = mock<SmsPort>();
  const phoneVerificationService = new PhoneVerificationService(
    phoneVerificationRepository,
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
});
