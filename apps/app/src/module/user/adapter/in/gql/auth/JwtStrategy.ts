import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Session } from './Session';
import { UserId } from '../../../../domain/User';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(jwtSecret: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { id: string }): Promise<Session> {
    return new Session(UserId(payload.id));
  }
}
