import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import { HttpClientService } from '@app/http-client/HttpClientService';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

import {
  assertResolvesFail,
  assertResolvesSuccess,
} from '../../../../apps/app/test/fixture/utils';
import app from '../fixture/FakeHttpServer';

describe('HttpClientService', () => {
  const httpClientService = new HttpClientService();
  let server: Server;
  let port: number;

  beforeAll(() => {
    server = app.listen(0);
    port = (server.address() as AddressInfo).port;
  });

  afterAll(
    async () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      }),
  );

  it.each([['get'], ['post'], ['put'], ['patch'], ['delete']] as const)(
    '%s 메서드 요청을 보낸다',
    async (method) => {
      // given
      const url = `http://localhost:${port}/api`;

      // when
      const result = httpClientService[method](url);

      // then
      await assertResolvesSuccess(result, (response) => {
        expect(response.isOk).toBe(true);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual('response');
      });
    },
  );

  it.skip('timeout 시간동안 응답이 없으면 에러가 발생한다', async () => {
    // given
    const url = `http://localhost:${port}/timeout`;

    // when
    const result = httpClientService.get(url);

    // then
    await assertResolvesFail(result);
  }, 10000);

  it('Query 요청에 대해 응답한다.', async () => {
    // given
    const url = `http://localhost:${port}/param`;
    const query = { foo: 'bar' };

    // when
    const result = httpClientService.get(url, { query });

    // then
    await assertResolvesSuccess(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        '"{\\"query\\":{\\"foo\\":\\"bar\\"},\\"body\\":{}}"',
      );
    });
  });

  it('Form 요청에 대해 응답한다.', async () => {
    // given
    const url = `http://localhost:${port}/param`;
    const form = { foo: 'bar' };

    // when
    const result = httpClientService.post(url, { form });

    // then
    await assertResolvesSuccess(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        '"{\\"query\\":{},\\"body\\":{\\"foo\\":\\"bar\\"}}"',
      );
    });
  });

  it('Body 요청에 대해 응답한다.', async () => {
    // given
    const url = `http://localhost:${port}/param`;
    const body = { foo: 'bar' };

    // when
    const result = httpClientService.post(url, { body });

    // then
    await assertResolvesSuccess(result, (response) => {
      expect(response.body).toMatchInlineSnapshot(
        '"{\\"query\\":{},\\"body\\":{\\"foo\\":\\"bar\\"}}"',
      );
    });
  });
});
