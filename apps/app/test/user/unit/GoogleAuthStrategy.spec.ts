import { HttpStatus } from '@nestjs/common';

import { StubHttpClientService } from '../../../../../libs/http-client/test/fixture/StubHttpClientService';
import { GoogleAuthResponse } from '../../../src/module/user/adapter/out/auth/response/GoogleAuthResponse';
import { GoogleProfileResponse } from '../../../src/module/user/adapter/out/auth/response/GoogleProfileResponse';
import { GoogleAuthStrategy } from '../../../src/module/user/adapter/out/auth/strategy/GoogleAuthStrategy';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('GoogleAuthStrategy', () => {
  const stubHttpClient = new StubHttpClientService();
  const strategy = new GoogleAuthStrategy(
    stubHttpClient,
    'clientId',
    'redirectUrl',
    'clientSecret',
  );

  beforeEach(() => stubHttpClient.clear());

  it('잘못된 인증코드를 요청한 경우 AuthError를 반환한다.', async () => {
    // given
    const errorContent = 'invalid code';
    stubHttpClient.addResponse(HttpStatus.BAD_REQUEST, errorContent);

    // when
    const result = strategy.request('invalid');

    // then
    await assertResolvesFail(result, (error) => {
      expect(error.message).toContain(errorContent);
    });
  });

  it('프로필 조회 실패 시 AuthError를 반환한다.', async () => {
    // given
    const errorContent = 'failed to get profile';
    const response = new GoogleAuthResponse();
    response.accessToken = 'token';
    stubHttpClient
      .addResponse(HttpStatus.OK, response)
      .addResponse(HttpStatus.UNAUTHORIZED, errorContent);

    // when
    const result = strategy.request('good code');

    // then
    await assertResolvesFail(result, (error) => {
      expect(error.message).toContain(errorContent);
    });
  });

  it('Google 인증 성공 시 Auth를 반환한다.', async () => {
    // given
    const authResponse = new GoogleAuthResponse();
    authResponse.accessToken = 'token';

    const profileResponse = new GoogleProfileResponse();
    const socialId = 1234;
    profileResponse.id = socialId;

    stubHttpClient
      .addResponse(HttpStatus.OK, authResponse)
      .addResponse(HttpStatus.OK, profileResponse);

    // when
    const result = strategy.request('good code');

    // then
    await assertResolvesSuccess(result, (auth) => {
      expect(auth.socialId).toBe(`${socialId}`);
      expect(auth.type).toBe(AuthType.GOOGLE);
    });
  });
});
