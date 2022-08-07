import { AuthError } from '@app/domain/error/AuthError';
import { Injectable } from '@nestjs/common';
import { TaskEither } from 'fp-ts/TaskEither';

import { AuthProviderPort } from '../../../application/port/out/AuthProviderPort';
import { Auth } from '../../../domain/vo/Auth';
import { AuthType } from '../../../domain/vo/AuthType';
import { AuthStrategy } from './strategy/AuthStrategy';
import { KakaoAuthStrategy } from './strategy/KakaoStrategy';

@Injectable()
export class AuthProvider extends AuthProviderPort {
  constructor(private readonly kakaoStrategy: KakaoAuthStrategy) {
    super();
  }

  findOne(code: string, type: AuthType): TaskEither<AuthError, Auth> {
    return this.requestClientFactory(type).request(code);
  }

  private requestClientFactory(type: AuthType): AuthStrategy {
    switch (type) {
      case AuthType.KAKAO:
        return this.kakaoStrategy;
      default:
        return this.kakaoStrategy;
    }
  }
}
