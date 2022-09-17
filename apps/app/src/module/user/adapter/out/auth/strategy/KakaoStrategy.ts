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
      TE.chain(this.toSocialResponse),
      TE.chain((res) => this.requestProfile(res)),
      TE.chain(this.toProfileResponse),
      TE.bimap((error) => new AuthError(error), this.toAuth),
    );
  }

  private requestSocialId(code: string): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.post(KakaoAuthStrategy.TOKEN_URL, {
      form: {
        grant_type: 'authorization_code',
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URL,
        code,
      },
    });
  }

  private toSocialResponse(
    response: HttpResponse,
  ): TaskEither<HttpError, KakaoAuthResponse> {
    return pipe(
      response.body(),
      TE.chain((body) =>
        response.isOk()
          ? response.toEntity(KakaoAuthResponse)
          : TE.left(
              HttpError.fromMessage(
                `카카오 토큰받기 실패: statusCode=${response.statusCode()} body=${body}`,
              ),
            ),
      ),
    );
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

  private toProfileResponse(
    response: HttpResponse,
  ): TaskEither<HttpError, KakaoProfileResponse> {
    return pipe(
      response.body(),
      TE.chain((body) =>
        response.isOk()
          ? response.toEntity(KakaoProfileResponse)
          : TE.left(
              HttpError.fromMessage(
                `카카오 프로필 정보 가져오기 실패: statusCode=${response.statusCode()} body=${body}`,
              ),
            ),
      ),
    );
  }

  private toAuth(response: KakaoProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.KAKAO);
  }
}
