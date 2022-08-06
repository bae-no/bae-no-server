import { AuthError } from '@app/domain/error/AuthError';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { ConfigService } from '@nestjs/config';
import { TaskEither } from 'fp-ts/TaskEither';

import { AuthProviderPort } from '../../../application/port/out/AuthProviderPort';
import { Auth } from '../../../domain/Auth';
import { AuthType } from '../../../domain/AuthType';
import { AuthStrategy } from './strategy/AuthStrategy';
import { KakaoAuthStrategy } from './strategy/KakaoStrategy';

export class AuthProvider extends AuthProviderPort {
  constructor(
    private readonly httpClientPort: HttpClientPort,
    private readonly config: ConfigService,
  ) {
    super();
  }

  findOne(code: string, type: AuthType): TaskEither<AuthError, Auth> {
    return this.requestClientFactory(type).request(code);
  }

  private requestClientFactory(type: AuthType): AuthStrategy<unknown, unknown> {
    switch (type) {
      case AuthType.KAKAO:
        return new KakaoAuthStrategy(this.httpClientPort, this.config);
      default:
        return new KakaoAuthStrategy(this.httpClientPort, this.config); // 임시
    }
  }
}
