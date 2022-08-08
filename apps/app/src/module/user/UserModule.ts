import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './adapter/in/gql/auth/JwtStrategy';
import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';
import { AuthProvider } from './adapter/out/auth/AuthProvider';
import { KakaoAuthStrategy } from './adapter/out/auth/strategy/KakaoStrategy';
import { JwtTokenGeneratorAdapter } from './adapter/out/jwt/JwtTokenGeneratorAdapter';
import { UserQueryRepositoryAdapter } from './adapter/out/persistence/UserQueryRepositoryAdapter';
import { UserRepositoryAdapter } from './adapter/out/persistence/UserRepositoryAdapter';
import { UserCommandUseCase } from './application/port/in/UserCommandUseCase';
import { AuthProviderPort } from './application/port/out/AuthProviderPort';
import { TokenGeneratorPort } from './application/port/out/TokenGeneratorPort';
import { UserQueryRepositoryPort } from './application/port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from './application/port/out/UserRepositoryPort';
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
    {
      provide: UserQueryRepositoryPort,
      useClass: UserQueryRepositoryAdapter,
    },
    {
      provide: UserRepositoryPort,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: TokenGeneratorPort,
      useClass: JwtTokenGeneratorAdapter,
    },
    KakaoAuthStrategy,
    JwtStrategy,
  ],
  imports: [
    HttpClientModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
})
export class UserModule {}
