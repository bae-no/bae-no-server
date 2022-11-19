import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';

import { JwtTokenGeneratorAdapter } from '../../../src/module/user/adapter/out/jwt/JwtTokenGeneratorAdapter';
import { UserFactory } from '../../fixture/UserFactory';

describe('JwtTokenGeneratorAdapter', () => {
  const jwtService = new JwtService({ secret: 'secret' });
  const jwtTokenGeneratorAdapter = new JwtTokenGeneratorAdapter(jwtService, 1);

  describe('generateByUser', () => {
    it('토큰을 생성한다', () => {
      // given
      const user = UserFactory.create();
      const now = new Date();

      // when
      const result = jwtTokenGeneratorAdapter.generateByUser(user, now);

      // then
      const payload = jwtService.decode(result.accessToken) as Record<
        string,
        any
      >;
      expect(payload.id).toBe(user.id);
      expect(result.expiredAt).toStrictEqual(addDays(now, 1));
    });
  });
});
