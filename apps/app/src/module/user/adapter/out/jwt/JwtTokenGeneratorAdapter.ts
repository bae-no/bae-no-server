import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import { pipe } from 'fp-ts/function';

import { AuthToken } from '../../../application/port/in/AuthToken';
import { TokenGeneratorPort } from '../../../application/port/out/TokenGeneratorPort';
import { User } from '../../../domain/User';

@Injectable()
export class JwtTokenGeneratorAdapter extends TokenGeneratorPort {
  private readonly expireDays: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.expireDays = Number(this.configService.get('JWT_EXPIRE_DAYS', '1'));
  }

  generateByUser(user: User, now: Date = new Date()): AuthToken {
    return pipe(
      this.jwtService.sign(
        { id: user.id },
        { expiresIn: `${this.expireDays}d` },
      ),
      (auth) => new AuthToken(auth, addDays(now, this.expireDays)),
    );
  }
}
