import { T } from '@app/custom/effect';
import { pipe } from '@app/custom/effect';
import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import type { HttpClientPort } from '@app/domain/http/HttpClientPort';
import type { HttpResponse } from '@app/domain/http/HttpResponse';

import type { AuthStrategy } from './AuthStrategy';
import { Auth } from '../../../../domain/vo/Auth';
import { AuthType } from '../../../../domain/vo/AuthType';
import { KakaoAuthResponse } from '../response/KakaoAuthResponse';
import { KakaoProfileResponse } from '../response/KakaoProfileResponse';

export class KakaoAuthStrategy implements AuthStrategy {
  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly clientId: string,
    private readonly redirectUrl: string,
    private readonly tokenUrl = 'https://kauth.kakao.com/oauth/token',
    private readonly userProfileUrl = 'https://kapi.kakao.com/v2/user/me',
  ) {}

  request(code: string): T.IO<AuthError, Auth> {
    return pipe(
      this.requestSocialId(code),
      T.chain(this.toSocialResponse),
      T.chain((res) => this.requestProfile(res)),
      T.chain(this.toProfileResponse),
      T.bimap((error) => new AuthError(error), this.toAuth),
    );
  }

  private requestSocialId(code: string): T.IO<HttpError, HttpResponse> {
    return this.httpClientPort.post(this.tokenUrl, {
      form: {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        redirect_uri: this.redirectUrl,
        code,
      },
    });
  }

  private toSocialResponse(
    response: HttpResponse,
  ): T.IO<HttpError, KakaoAuthResponse> {
    if (response.isOk) {
      return T.fromEither(() => response.toEntity(KakaoAuthResponse));
    }

    return T.fail(
      HttpError.fromMessage(
        `카카오 토큰받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private requestProfile(
    authResponse: KakaoAuthResponse,
  ): T.IO<HttpError, HttpResponse> {
    return this.httpClientPort.get(this.userProfileUrl, {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    });
  }

  private toProfileResponse(
    response: HttpResponse,
  ): T.IO<HttpError, KakaoProfileResponse> {
    if (response.isOk) {
      return T.fromEither(() => response.toEntity(KakaoProfileResponse));
    }

    return T.fail(
      HttpError.fromMessage(
        `카카오 프로필 받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private toAuth(response: KakaoProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.KAKAO);
  }
}
