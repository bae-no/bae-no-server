import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';

import { UserPushTokenOrmMapper } from '../../../src/module/user-push-token/adapter/out/persistence/UserPushTokenOrmMapper';
import { UserPushTokenQueryRepositoryAdapter } from '../../../src/module/user-push-token/adapter/out/persistence/UserPushTokenQueryRepositoryAdapter';
import { assertResolvesRight } from '../../fixture/utils';

describe('UserPushTokenQueryRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const userPushTokenQueryRepositoryAdapter =
    new UserPushTokenQueryRepositoryAdapter(prisma);

  beforeEach(async () =>
    prisma.$transaction([prisma.userPushToken.deleteMany()]),
  );

  describe('findByUserIds', () => {
    it('존재하지 않는 id 로 요청하면 빈 배열을 반환한다', async () => {
      // given
      const id = faker.database.mongodbObjectId();

      // when
      const result = userPushTokenQueryRepositoryAdapter.findByUserIds([id]);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(0);
      });
    });

    it('존재하는 데이터를 가져온다', async () => {
      // given
      const userPushToken = await prisma.userPushToken
        .create({
          data: {
            token: faker.random.alphaNumeric(10),
            userId: faker.database.mongodbObjectId(),
          },
        })
        .then(UserPushTokenOrmMapper.toDomain);

      // when
      const result = userPushTokenQueryRepositoryAdapter.findByUserIds([
        userPushToken.userId,
      ]);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toStrictEqual([userPushToken]);
      });
    });
  });
});
