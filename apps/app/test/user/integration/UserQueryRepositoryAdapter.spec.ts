import { PrismaService } from '@app/prisma/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';

import { UserOrmMapper } from '../../../src/module/user/adapter/out/persistence/UserOrmMapper';
import { UserQueryRepositoryAdapter } from '../../../src/module/user/adapter/out/persistence/UserQueryRepositoryAdapter';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertNone, assertResolvesRight, assertSome } from '../../fixture';

describe('UserQueryRepositoryAdapter', () => {
  let userQueryRepositoryAdapter: UserQueryRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueryRepositoryAdapter, PrismaService],
    }).compile();

    userQueryRepositoryAdapter = module.get(UserQueryRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.user.deleteMany()]));

  describe('findByAuth', () => {
    it('auth 를 가진 유저가 존재하지 않으면 none 을 반환한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);

      // when
      const result = userQueryRepositoryAdapter.findByAuth(auth);

      // then
      await assertResolvesRight(result, (value) => {
        assertNone(value);
      });
    });

    it('auth 를 가진 유저를 반환한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      await prisma.user.create({
        data: UserOrmMapper.toOrm(User.byAuth(auth)),
      });

      // when
      const result = userQueryRepositoryAdapter.findByAuth(auth);

      // then
      await assertResolvesRight(result, (value) => {
        assertSome(value, (user) => {
          expect(user.auth).toStrictEqual(auth);
        });
      });
    });
  });
});