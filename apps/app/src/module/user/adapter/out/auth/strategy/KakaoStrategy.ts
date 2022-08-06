import { HttpError } from '@app/domain/error/HttpError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { ConfigService } from '@nestjs/config';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/Auth';
import { AuthType } from '../../../../domain/AuthType';
import { KakaoAuthResponse } from '../response/KakaoAuthResponse';
import { KakaoProfileResponse } from '../response/KakaoProfileResponse';
import { AuthStrategy } from './AuthStrategy';

export class KakaoAuthStrategy extends AuthStrategy<
  KakaoAuthResponse,
  KakaoProfileResponse
> {
  private static readonly TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private static readonly USER_PROFILE_URL =
    'https://kapi.kakao.com/v2/user/me';

  private readonly GRANT_TOKEN: string;
  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;

  constructor(httpClientPort: HttpClientPort, config: ConfigService) {
    super(httpClientPort, config);
    this.GRANT_TOKEN = this.config.get<string>('KAKAO_GRANT_TOKEN') ?? '';
    this.CLIENT_ID = this.config.get<string>('KAKAO_CLIENT_ID') ?? '';
    this.REDIRECT_URL = this.config.get<string>('KAKAO_REDIRECT_URL') ?? '';
  }

  override requestSocialId(code: string): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.post(KakaoAuthStrategy.TOKEN_URL, {
      form: {
        grant_type: this.GRANT_TOKEN,
        client_id: this.CLIENT_ID,
        redirect_uri: this.REDIRECT_URL,
        code,
      },
    });
  }

  override toSocialResponse(response: HttpResponse): KakaoAuthResponse {
    return response.toEntity(KakaoAuthResponse);
  }

  override requestProfile(
    authResponse: KakaoAuthResponse,
  ): TaskEither<HttpError, HttpResponse> {
    return this.httpClientPort.get(KakaoAuthStrategy.USER_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${authResponse.accessToken}`,
      },
    });
  }

  override toProfileResponse(response: HttpResponse): KakaoProfileResponse {
    return response.toEntity(KakaoProfileResponse);
  }

  override toAuth(response: KakaoProfileResponse): Auth {
    return new Auth(`${response.id}`, AuthType.KAKAO);
  }
}
