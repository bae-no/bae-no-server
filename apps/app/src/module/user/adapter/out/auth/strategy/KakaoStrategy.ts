import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { TE } from '@app/external/fp-ts';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/vo/Auth';
import { AuthType } from '../../../../domain/vo/AuthType';
import { KakaoAuthResponse } from '../response/KakaoAuthResponse';
import { KakaoProfileResponse } from '../response/KakaoProfileResponse';
import { AuthStrategy } from './AuthStrategy';

@Injectable()
export class KakaoAuthStrategy implements AuthStrategy {
  private static readonly TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private static readonly USER_PROFILE_URL =
    'https://kapi.kakao.com/v2/user/me';

  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;

  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly config: ConfigService,
  ) {
    this.CLIENT_ID = this.config.get('KAKAO_CLIENT_ID', '');
    this.REDIRECT_URL = this.config.get('KAKAO_REDIRECT_URL', '');
  }

  request(code: string): TaskEither<AuthError, Auth> {
    return pipe(
      this.requestSocialId(code),
      TE.map(this.toSocialResponse),
      TE.chain((res) => this.requestProfile(res)),
      TE.map(this.toProfileResponse),
      TE.bimap((error) => new AuthError(error), this.toAuth),
    );
  }

  private requestSocialId(code: string): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.post(KakaoAuthStrategy.TOKEN_URL, {
      form: {
        grant_type: 'code',
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URL,
        code,
      },
    });
  }

  private toSocialResponse(response: HttpResponse): KakaoAuthResponse {
    return response.toEntity(KakaoAuthResponse);
  }

  private requestProfile(
    authResponse: KakaoAuthResponse,
  ): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.get(KakaoAuthStrategy.USER_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    });
  }

  private toProfileResponse(response: HttpResponse): KakaoProfileResponse {
    return response.toEntity(KakaoProfileResponse);
  }

  private toAuth(response: KakaoProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.KAKAO);
  }
}
