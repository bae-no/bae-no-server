import { E, TE } from '@app/custom/fp-ts';
import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Either } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/vo/Auth';
import { AuthType } from '../../../../domain/vo/AuthType';
import { GoogleAuthResponse } from '../response/GoogleAuthResponse';
import { GoogleProfileResponse } from '../response/GoogleProfileResponse';
import { AuthStrategy } from './AuthStrategy';

@Injectable()
export class GoogleAuthStrategy implements AuthStrategy {
  private static readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private static readonly USER_PROFILE_URL =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;
  private readonly CLIENT_SECRET: string;

  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly config: ConfigService,
  ) {
    this.CLIENT_ID = this.config.get('GOOGLE_CLIENT_ID', '');
    this.CLIENT_SECRET = this.config.get('GOOGLE_CLIENT_SECRET', '');
    this.REDIRECT_URL = this.config.get('GOOGLE_REDIRECT_URL', '');
  }

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
    return this.httpClientPort.post(GoogleAuthStrategy.TOKEN_URL, {
      form: {
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URL,
        client_secret: this.CLIENT_SECRET,
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
    return this.httpClientPort.get(GoogleAuthStrategy.USER_PROFILE_URL, {
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
