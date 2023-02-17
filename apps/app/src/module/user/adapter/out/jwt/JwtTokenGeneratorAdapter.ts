import type { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import { pipe } from 'fp-ts/function';

import { AuthToken } from '../../../application/port/in/dto/AuthToken';
import { TokenGeneratorPort } from '../../../application/port/out/TokenGeneratorPort';
import type { User } from '../../../domain/User';

export class JwtTokenGeneratorAdapter extends TokenGeneratorPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly expireDays: number,
  ) {
    super();
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
