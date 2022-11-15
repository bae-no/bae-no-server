import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { UserPushTokenRepositoryAdapter } from '../../../src/module/user-push-token/adapter/out/persistence/UserPushTokenRepositoryAdapter';
import { UserPushToken } from '../../../src/module/user-push-token/domain/UserPushToken';
import { assertResolvesRight } from '../../fixture/utils';

describe('UserPushTokenRepositoryAdapter', () => {
  let userPushTokenRepositoryAdapter: UserPushTokenRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPushTokenRepositoryAdapter, PrismaService],
    }).compile();

    userPushTokenRepositoryAdapter = module.get(UserPushTokenRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () =>
    prisma.$transaction([prisma.userPushToken.deleteMany()]),
  );

  describe('save', () => {
    it('주어진 푸시토큰 데이터를 생성한다', async () => {
      // given
      const userToken = new UserPushToken({
        userId: faker.database.mongodbObjectId(),
        token: 'token',
      });

      // when
      const result = userPushTokenRepositoryAdapter.save(userToken);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.id).not.toBeUndefined();
        expect(value.userId).toBe(userToken.userId);
        expect(value.token).toBe(userToken.token);
      });
    });
  });
});
