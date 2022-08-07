import { PrismaService } from '@app/prisma/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';

import { UserRepositoryAdapter } from '../../../src/module/user/adapter/out/persistence/UserRepositoryAdapter';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesRight } from '../../fixture';

describe('UserRepositoryAdapter', () => {
  let userRepositoryAdapter: UserRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepositoryAdapter, PrismaService],
    }).compile();

    userRepositoryAdapter = module.get(UserRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.user.deleteMany()]));

  describe('save', () => {
    it('주어진 사용자를 생성한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);

      // when
      const result = userRepositoryAdapter.save(user);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.id).toBeTruthy();
        expect(value.auth).toStrictEqual(auth);
      });
    });
  });
});
