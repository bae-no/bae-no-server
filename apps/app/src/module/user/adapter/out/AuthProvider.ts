import { AuthError } from '@app/domain/error/AuthError';
import { TE } from '@app/domain/fp-ts';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { ConfigService } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { AuthProviderPort } from '../../application/port/out/AuthProviderPort';
import { Auth } from '../../domain/Auth';
import { AuthType } from '../../domain/AuthType';

export class AuthProvider extends AuthProviderPort {
  private static readonly TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private static readonly USER_PROFILE_URL =
    'https://kapi.kakao.com/v2/user/me';

  private readonly GRANT_TOKEN: string;
  private readonly CLIENT_ID: string;
  private readonly REDIRECT_URL: string;

  constructor(
    private readonly httpClient: HttpClientPort,
    private readonly config: ConfigService,
  ) {
    super();
    this.GRANT_TOKEN = this.config.get<string>('KAKAO_GRANT_TOKEN') ?? '';
    this.CLIENT_ID = this.config.get<string>('KAKAO_CLIENT_ID') ?? '';
    this.REDIRECT_URL = this.config.get<string>('KAKAO_REDIRECT_URL') ?? '';
  }

  findOne(code: string, type: AuthType): TaskEither<AuthError, Auth> {
    return pipe(
      this.httpClient.post(AuthProvider.TOKEN_URL, {
        form: {
          grant_type: this.GRANT_TOKEN,
          client_id: this.CLIENT_ID,
          redirect_uri: this.REDIRECT_URL,
          code,
        },
      }),
      TE.map((response) => response.toEntity(KakaoAuthResponse)),
      TE.chain(({ accessToken }) =>
        this.httpClient.get(AuthProvider.USER_PROFILE_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ),
      TE.map((response) => response.toEntity(KakaoProfileResponse)),
      TE.bimap(
        (error) => new AuthError(error),
        ({ id }) => new Auth(`${id}`, type),
      ),
    );
  }
}

class KakaoAuthResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;
}

class KakaoProfileResponse {
  @Expose()
  id: number;
}
