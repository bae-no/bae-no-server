import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { Module } from '@nestjs/common';

import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';
import { AuthProvider } from './adapter/out/auth/AuthProvider';
import { KakaoAuthStrategy } from './adapter/out/auth/strategy/KakaoStrategy';
import { UserCommandUseCase } from './application/port/in/UserCommandUseCase';
import { AuthProviderPort } from './application/port/out/AuthProviderPort';
import { UserCommandService } from './application/service/UserCommandService';

@Module({
  providers: [
    UserMutationResolver,
    {
      provide: UserCommandUseCase,
      useClass: UserCommandService,
    },
    {
      provide: AuthProviderPort,
      useClass: AuthProvider,
    },
    KakaoAuthStrategy,
  ],
  imports: [HttpClientModule],
})
export class UserModule {}
