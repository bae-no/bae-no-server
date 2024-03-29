import { HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';

import { StubHttpClientService } from '../../../../../libs/http-client/test/fixture/StubHttpClientService';
import { KakaoAuthResponse } from '../../../src/module/user/adapter/out/auth/response/KakaoAuthResponse';
import { KakaoProfileResponse } from '../../../src/module/user/adapter/out/auth/response/KakaoProfileResponse';
import { KakaoAuthStrategy } from '../../../src/module/user/adapter/out/auth/strategy/KakaoAuthStrategy';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('KakaoAuthStrategy', () => {
  const stubHttpClient = new StubHttpClientService();
  const strategy = new KakaoAuthStrategy(
    stubHttpClient,
    'clientId',
    'redirectUrl',
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
    const response = new KakaoAuthResponse();
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

  it('Kakao 인증 성공 시 Auth를 반환한다.', async () => {
    // given
    const authResponse = new KakaoAuthResponse();
    authResponse.accessToken = 'token';

    const profileResponse = new KakaoProfileResponse();
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
      expect(auth.type).toBe(AuthType.KAKAO);
    });
  });
});
