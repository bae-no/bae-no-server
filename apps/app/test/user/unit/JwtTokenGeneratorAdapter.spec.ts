import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { addDays } from 'date-fns';

import { JwtTokenGeneratorAdapter } from '../../../src/module/user/adapter/out/jwt/JwtTokenGeneratorAdapter';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';

describe('JwtTokenGeneratorAdapter', () => {
  let jwtTokenGeneratorAdapter: JwtTokenGeneratorAdapter;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, JwtModule.register({ secret: 'secret' })],
      providers: [JwtTokenGeneratorAdapter],
    }).compile();

    jwtTokenGeneratorAdapter = module.get(JwtTokenGeneratorAdapter);
    jwtService = module.get(JwtService);
  });

  describe('generateByUser', function () {
    it('토큰을 생성한다', function () {
      // given
      const user = User.byAuth(new Auth('socialId', AuthType.GOOGLE)).setBase(
        'abcd1234',
        new Date(),
        new Date(),
      );
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
