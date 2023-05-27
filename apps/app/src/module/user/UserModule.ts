import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpClientModule } from '@app/http-client/HttpClientModule';
import { SmsModule } from '@app/sms/SmsModule';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { JwtStrategy } from './adapter/in/gql/auth/JwtStrategy';
import { PhoneVerificationMutationResolver } from './adapter/in/gql/PhoneVerificationMutationResolver';
import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';
import { UserQueryResolver } from './adapter/in/gql/UserQueryResolver';
import { AuthProvider } from './adapter/out/auth/AuthProvider';
import { GoogleAuthStrategy } from './adapter/out/auth/strategy/GoogleAuthStrategy';
import { KakaoAuthStrategy } from './adapter/out/auth/strategy/KakaoAuthStrategy';
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
      inject: [JwtService, ConfigService],
      useFactory: (jwtService: JwtService, configService: ConfigService) =>
        new JwtTokenGeneratorAdapter(
          jwtService,
          Number(configService.getOrThrow('JWT_EXPIRE_DAYS')),
        ),
    },
    {
      provide: PhoneVerificationUseCase,
      useClass: PhoneVerificationService,
    },
    {
      provide: PhoneVerificationRepositoryPort,
      useClass: PhoneVerificationRepositoryAdapter,
    },
    {
      provide: KakaoAuthStrategy,
      inject: [HttpClientPort, ConfigService],
      useFactory: (
        httpClientPort: HttpClientPort,
        configService: ConfigService,
      ) =>
        new KakaoAuthStrategy(
          httpClientPort,
          configService.getOrThrow('KAKAO_CLIENT_ID'),
          configService.getOrThrow('KAKAO_REDIRECT_URL'),
        ),
    },
    {
      provide: GoogleAuthStrategy,
      inject: [HttpClientPort, ConfigService],
      useFactory: (
        httpClientPort: HttpClientPort,
        configService: ConfigService,
      ) =>
        new GoogleAuthStrategy(
          httpClientPort,
          configService.getOrThrow('GOOGLE_CLIENT_ID'),
          configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
          configService.getOrThrow('GOOGLE_REDIRECT_URL'),
        ),
    },
    {
      provide: JwtStrategy,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new JwtStrategy(configService.getOrThrow('JWT_SECRET')),
    },
  ],
  imports: [
    HttpClientModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    SmsModule,
  ],
  exports: [UserQueryRepositoryPort],
})
export class UserModule {}
