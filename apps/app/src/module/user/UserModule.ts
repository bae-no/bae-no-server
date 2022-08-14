import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { SmsModule } from '@app/sms/SmsModule';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './adapter/in/gql/auth/JwtStrategy';
import { PhoneVerificationMutationResolver } from './adapter/in/gql/PhoneVerificationMutationResolver';
import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';
import { UserQueryResolver } from './adapter/in/gql/UserQueryResolver';
import { AuthProvider } from './adapter/out/auth/AuthProvider';
import { KakaoAuthStrategy } from './adapter/out/auth/strategy/KakaoStrategy';
import { JwtTokenGeneratorAdapter } from './adapter/out/jwt/JwtTokenGeneratorAdapter';
import { PhoneVerificationRepositoryAdapter } from './adapter/out/persistence/PhoneVerificationRepositoryAdapter';
import { UserQueryRepositoryAdapter } from './adapter/out/persistence/UserQueryRepositoryAdapter';
import { UserRepositoryAdapter } from './adapter/out/persistence/UserRepositoryAdapter';
import { PhoneVerificationUseCase } from './application/port/in/PhoneVerificationUseCase';
import { UserCommandUseCase } from './application/port/in/UserCommandUseCase';
import { AuthProviderPort } from './application/port/out/AuthProviderPort';
import { PhoneVerificationRepositoryPort } from './application/port/out/PhoneVerificationRepositoryPort';
import { TokenGeneratorPort } from './application/port/out/TokenGeneratorPort';
import { UserQueryRepositoryPort } from './application/port/out/UserQueryRepositoryPort';
import { UserRepositoryPort } from './application/port/out/UserRepositoryPort';
import { PhoneVerificationService } from './application/service/PhoneVerificationService';
import { UserCommandService } from './application/service/UserCommandService';

@Module({
  providers: [
    UserQueryResolver,
    UserMutationResolver,
    PhoneVerificationMutationResolver,
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
    {
      provide: PhoneVerificationUseCase,
      useClass: PhoneVerificationService,
    },
    {
      provide: PhoneVerificationRepositoryPort,
      useClass: PhoneVerificationRepositoryAdapter,
    },
    KakaoAuthStrategy,
    JwtStrategy,
  ],
  imports: [
    HttpClientModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    SmsModule,
  ],
})
export class UserModule {}
