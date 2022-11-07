import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { ShareDealOrmMapper } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealOrmMapper';
import { ShareDealRepositoryAdapter } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealRepositoryAdapter';
import { ShareDeal } from '../../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ShareZone } from '../../../src/module/share-deal/domain/vo/ShareZone';
import { assertResolvesRight } from '../../fixture/utils';

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
        orderPrice: 2000,
        ownerId: faker.database.mongodbObjectId(),
        storeName: 'store',
        thumbnail: 'thumbnail',
        zone: shareZone,
        minParticipants: 2,
      });

      // when
      const result = shareDealRepositoryAdapter.save(shareDeal);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toStrictEqual(expect.objectContaining(shareDeal));
      });
    });

    it('주어진 공유딜을 수정한다', async () => {
      // given
      const shareDeal = ShareDeal.open({
        title: 'title',
        category: FoodCategory.AMERICAN,
        orderPrice: 2000,
        ownerId: faker.database.mongodbObjectId(),
        storeName: 'store',
        thumbnail: 'thumbnail',
        zone: new ShareZone('road', 'detail', 0, 0),
        minParticipants: 2,
      });
      const newShareDeal = await prisma.shareDeal
        .create({ data: ShareDealOrmMapper.toOrm(shareDeal) })
        .then(ShareDealOrmMapper.toDomain);
      newShareDeal.join(faker.database.mongodbObjectId());

      // when
      const result = shareDealRepositoryAdapter.save(newShareDeal);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.participantInfo.current).toBe(2);
      });
    });
  });
});
