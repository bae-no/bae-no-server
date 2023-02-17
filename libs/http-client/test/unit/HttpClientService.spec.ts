import type { Server } from 'http';

import { HttpClientService } from '@app/http-client/HttpClientService';

import {
  assertResolvesLeft,
  assertResolvesRight,
} from '../../../../apps/app/test/fixture/utils';
import app from '../fixture/FakeHttpServer';

describe('HttpClientService', () => {
  const httpClientService = new HttpClientService();
  let server: Server;

  beforeAll(() => {
    server = app.listen(8080);
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it.each([['get'], ['post'], ['put'], ['patch'], ['delete']] as const)(
    '%s 메서드 요청을 보낸다',
    async (method) => {
      // given
      const url = 'http://localhost:8080/api';

      // when
      const result = httpClientService[method](url);

      // then
      await assertResolvesRight(result, (response) => {
        expect(response.isOk).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual('response');
      });
    },
  );

  it.skip('timeout 시간동안 응답이 없으면 에러가 발생한다', async () => {
    // given
    const url = 'http://localhost:8080/timeout';

    // when
    const result = httpClientService.get(url);

    // then
    await assertResolvesLeft(result);
  }, 10000);

  it('Query 요청에 대해 응답한다.', async () => {
    // given
    const url = 'http://localhost:8080/param';
    const query = { foo: 'bar' };

    // when
    const result = httpClientService.get(url, { query });

    // then
    await assertResolvesRight(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        `"{"query":{"foo":"bar"},"body":{}}"`,
      );
    });
  });

  it('Form 요청에 대해 응답한다.', async () => {
    // given
    const url = 'http://localhost:8080/param';
    const form = { foo: 'bar' };

    // when
    const result = httpClientService.post(url, { form });

    // then
    await assertResolvesRight(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        `"{"query":{},"body":{"foo":"bar"}}"`,
      );
    });
  });

  it('Body 요청에 대해 응답한다.', async () => {
    // given
    const url = 'http://localhost:8080/param';
    const body = { foo: 'bar' };

    // when
    const result = httpClientService.post(url, { body });

    // then
    await assertResolvesRight(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        `"{"query":{},"body":{"foo":"bar"}}"`,
      );
    });
  });
});
