import { E, TE } from '@app/custom/fp-ts';
import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { Either } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/vo/Auth';
import { AuthType } from '../../../../domain/vo/AuthType';
import { GoogleAuthResponse } from '../response/GoogleAuthResponse';
import { GoogleProfileResponse } from '../response/GoogleProfileResponse';
import { AuthStrategy } from './AuthStrategy';

export class GoogleAuthStrategy implements AuthStrategy {
  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly clientId: string,
    private readonly redirectUrl: string,
    private readonly clientSecret: string,
    private readonly tokenUrl = 'https://oauth2.googleapis.com/token',
    private readonly userProfileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo',
  ) {}

  request(code: string): TaskEither<AuthError, Auth> {
    return pipe(
      this.requestSocialId(code),
      TE.chainEitherK(this.toSocialResponse),
      TE.chain((res) => this.requestProfile(res)),
      TE.chainEitherK(this.toProfileResponse),
      TE.bimap((error) => new AuthError(error), this.toAuth),
    );
  }

  private requestSocialId(code: string): TaskEither<HttpError, HttpResponse> {
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
  ): Either<HttpError, GoogleAuthResponse> {
    if (response.isOk) {
      return response.toEntity(GoogleAuthResponse);
    }

    return E.left(
      HttpError.fromMessage(
        `Google 토큰받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private requestProfile(
    authResponse: GoogleAuthResponse,
  ): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.get(this.userProfileUrl, {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    });
  }

  private toProfileResponse(
    response: HttpResponse,
  ): Either<HttpError, GoogleProfileResponse> {
    if (response.isOk) {
      return response.toEntity(GoogleProfileResponse);
    }

    return E.left(
      HttpError.fromMessage(
        `Google 프로필 받기 실패: statusCode=${response.statusCode} body=${response.body}`,
      ),
    );
  }

  private toAuth(response: GoogleProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.GOOGLE);
  }
}
