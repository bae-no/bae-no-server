import 'reflect-metadata';

import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { SmsToastService } from '@app/sms/SmsToastService';
import { ConfigService } from '@nestjs/config';
import { left, right } from 'fp-ts/TaskEither';
import { mock } from 'jest-mock-extended';

import {
  assertResolvesLeft,
  assertResolvesRight,
} from '../../../../apps/app/test/fixture';
import { FakeHttpResponse } from '../../../http-client/test/fixture/FakeHttpResponse';

describe('SmsToastService', () => {
  const httpClientPort = mock<HttpClientPort>();
  const configService = mock<ConfigService>();
  configService.get.mockReturnValue('');

  const service = new SmsToastService(httpClientPort, configService);

  describe('send', () => {
    it('isSuccessful이 true인 경우 성공한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const response = FakeHttpResponse.of({
        body: JSON.stringify({ header: { isSuccessful: true } }),
      });

      httpClientPort.post.mockReturnValue(right(response));

      // when
      const result = service.send(phoneNumber, content);

      // then
      await assertResolvesRight(result);
    });

    it('isSuccessful이 false인 경우 실패한다.', async () => {
      // given
      const phoneNumber = '01012345678';
      const content = 'content';
      const response = FakeHttpResponse.of({
        body: JSON.stringify({ header: { isSuccessful: false } }),
      });

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
