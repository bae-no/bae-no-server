import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserId } from '../../../src/module/user/domain/User';
import { UserPushTokenRepositoryAdapter } from '../../../src/module/user-push-token/adapter/out/persistence/UserPushTokenRepositoryAdapter';
import { UserPushToken } from '../../../src/module/user-push-token/domain/UserPushToken';
import { assertResolvesSuccess } from '../../fixture/utils';

describe('UserPushTokenRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const userPushTokenRepositoryAdapter = new UserPushTokenRepositoryAdapter(
    prisma,
  );

  beforeEach(async () => {
    await prisma.$transaction([prisma.userPushToken.deleteMany()]);
  });

  describe('save', () => {
    it('주어진 푸시토큰 데이터를 생성한다', async () => {
      // given
      const userToken = new UserPushToken({
        userId: UserId(faker.database.mongodbObjectId()),
        token: 'token',
      });

      // when
      const result = userPushTokenRepositoryAdapter.save(userToken);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.id).not.toBeUndefined();
        expect(value.userId).toBe(userToken.userId);
        expect(value.token).toBe(userToken.token);
      });
    });
  });
});
