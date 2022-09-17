import 'reflect-metadata';

import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsResponse } from '@app/sms/SmsResponse';
import { SmsSensService } from '@app/sms/SmsSensService';
import { ConfigService } from '@nestjs/config';
import { left, right } from 'fp-ts/TaskEither';
import { mock } from 'jest-mock-extended';

import {
  assertResolvesLeft,
  assertResolvesRight,
} from '../../../../apps/app/test/fixture';
import { FakeHttpResponse } from '../../../http-client/test/fixture/FakeHttpResponse';

describe('SmsSensService', () => {
  const httpClientPort = mock<HttpClientPort>();
  const configService = mock<ConfigService>();
  configService.get.mockReturnValue('');

  const service = new SmsSensService(httpClientPort, configService);

  describe('send', () => {
    it('상태코드 202 로 응답한 경우 성공한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const smsResponse = new SmsResponse();
      smsResponse.statusCode = '202';
      const response = FakeHttpResponse.of({ entity: smsResponse });

      httpClientPort.post.mockReturnValue(right(response));

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesRight(result);
    });

    it('상태코드 202 가 아닌경우 실패한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const smsResponse = new SmsResponse();
      smsResponse.statusCode = '404';
      const response = FakeHttpResponse.of({ entity: smsResponse });

      httpClientPort.post.mockReturnValue(right(response));

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err.message).toContain('SMS 발송이 실패했습니다');
      });
    });

    it('Http 통신이 불안정한 경우 실패한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';

      httpClientPort.post.mockReturnValue(
        left(new HttpError(new Error('http error'))),
      );

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err.message).toContain('http error');
      });
    });
  });
});
