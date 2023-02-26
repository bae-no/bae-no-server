import { SmsResponse } from '@app/sms/SmsResponse';
import { SmsSensService } from '@app/sms/SmsSensService';
import { HttpStatus } from '@nestjs/common';

import {
  assertResolvesFail,
  assertResolvesSuccess,
} from '../../../../apps/app/test/fixture/utils';
import { StubHttpClientService } from '../../../http-client/test/fixture/StubHttpClientService';

describe('SmsSensService', () => {
  const stubHttpClientService = new StubHttpClientService();

  const service = new SmsSensService(
    stubHttpClientService,
    'serviceId',
    'accessKey',
    'secretKey',
    'sendNumber',
  );

  beforeEach(() => stubHttpClientService.clear());

  describe('send', () => {
    it('상태코드 202 로 응답한 경우 성공한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const smsResponse = new SmsResponse();
      smsResponse.statusCode = '202';

      stubHttpClientService.addResponse(HttpStatus.OK, smsResponse);

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesSuccess(result);
    });

    it('상태코드 202 가 아닌경우 실패한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const smsResponse = new SmsResponse();
      smsResponse.statusCode = '404';

      stubHttpClientService.addResponse(HttpStatus.OK, smsResponse);

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesFail(result, (err) => {
        expect(err.message).toContain('SMS 발송이 실패했습니다');
      });
    });

    it('Http 통신이 불안정한 경우 실패한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';

      stubHttpClientService.addError(new Error('http error'));

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesFail(result, (err) => {
        expect(err.message).toContain('http error');
      });
    });
  });
});
