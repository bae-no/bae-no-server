import { Service } from '@app/custom/nest/decorator/Service';
import type { AuthError } from '@app/domain/error/AuthError';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { AuthStrategy } from './strategy/AuthStrategy';
import { GoogleAuthStrategy } from './strategy/GoogleAuthStrategy';
import { KakaoAuthStrategy } from './strategy/KakaoAuthStrategy';
import { AuthProviderPort } from '../../../application/port/out/AuthProviderPort';
import type { Auth } from '../../../domain/vo/Auth';
import { AuthType } from '../../../domain/vo/AuthType';

@Service()
export class AuthProvider extends AuthProviderPort {
  constructor(
    private readonly kakaoStrategy: KakaoAuthStrategy,
    private readonly googleStrategy: GoogleAuthStrategy,
  ) {
    super();
  }

  findOne(code: string, type: AuthType): TaskEither<AuthError, Auth> {
    return this.requestClientFactory(type).request(code);
  }

  private requestClientFactory(type: AuthType): AuthStrategy {
    switch (type) {
      case AuthType.KAKAO:
        return this.kakaoStrategy;
      case AuthType.GOOGLE:
        return this.googleStrategy;
      default:
        return this.kakaoStrategy;
    }
  }
}
