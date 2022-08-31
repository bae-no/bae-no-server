import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ShareDealRepositoryAdapter } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealRepositoryAdapter';
import { ShareDeal } from '../../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ShareZone } from '../../../src/module/share-deal/domain/vo/ShareZone';
import { assertResolvesRight } from '../../fixture';

describe('ShareDealRepositoryAdapter', () => {
  let shareDealRepositoryAdapter: ShareDealRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareDealRepositoryAdapter, PrismaService],
    }).compile();

    shareDealRepositoryAdapter = module.get(ShareDealRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.shareDeal.deleteMany()]));

  describe('save', () => {
    it('주어진 공유딜을 생성한다', async () => {
      // given
      const shareZone = new ShareZone('road', 'detail', 0, 0);
      const shareDeal = ShareDeal.open({
        title: 'title',
        category: FoodCategory.AMERICAN,
        minParticipants: 4,
        orderPrice: 2000,
        ownerId: faker.database.mongodbObjectId(),
        storeName: 'store',
        zone: shareZone,
      });

      // when
      const result = shareDealRepositoryAdapter.save(shareDeal);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toStrictEqual(expect.objectContaining(shareDeal));
      });
    });
  });
});
