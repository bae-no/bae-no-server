import { T, pipe } from '@app/custom/effect';
import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import type { HttpResponse } from '@app/domain/http/HttpResponse';

import type { AuthStrategy } from './AuthStrategy';
import { Auth } from '../../../../domain/vo/Auth';
import { AuthType } from '../../../../domain/vo/AuthType';
import { GoogleAuthResponse } from '../response/GoogleAuthResponse';
import { GoogleProfileResponse } from '../response/GoogleProfileResponse';

export class GoogleAuthStrategy implements AuthStrategy {
  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly clientId: string,
    private readonly redirectUrl: string,
    private readonly clientSecret: string,
    private readonly tokenUrl = 'https://oauth2.googleapis.com/token',
    private readonly userProfileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo',
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
        client_secret: this.clientSecret,
        code,
      },
    });
  }

  private toSocialResponse(
    response: HttpResponse,
  ): T.IO<HttpError, GoogleAuthResponse> {
    if (response.isOk) {
      return T.fromEither(() => response.toEntity(GoogleAuthResponse));
    }

    return T.fail(
      HttpError.fromMessage(
        `Google 토큰받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private requestProfile(
    authResponse: GoogleAuthResponse,
  ): T.IO<HttpError, HttpResponse> {
    return this.httpClientPort.get(this.userProfileUrl, {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    });
  }

  private toProfileResponse(
    response: HttpResponse,
  ): T.IO<HttpError, GoogleProfileResponse> {
    if (response.isOk) {
      return T.fromEither(() => response.toEntity(GoogleProfileResponse));
    }

    return T.fail(
      HttpError.fromMessage(
        `Google 프로필 받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private toAuth(response: GoogleProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.GOOGLE);
  }
}
