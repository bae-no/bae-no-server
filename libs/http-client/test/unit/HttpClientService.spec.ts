import { Server } from 'http';

import { HttpClientService } from '@app/http-client/HttpClientService';

import {
  assertResolvesLeft,
  assertResolvesRight,
} from '../../../../apps/app/test/fixture';
import app from '../fixture/FakeHttpServer';

describe('HttpClientService', () => {
  const httpClientService = new HttpClientService();
  let server: Server;

  beforeAll(() => {
    server = app.listen(8080);
  });

  afterAll(() => server.close());

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

  it('timeout 시간동안 응답이 없으면 에러가 발생한다', async () => {
    // given
    const url = 'http://localhost:8080/timeout';

    // when
    const result = httpClientService.get(url);

    // then
    await assertResolvesLeft(result);
  }, 10000);
});
