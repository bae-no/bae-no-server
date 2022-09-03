import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { addDays, compareDesc, isBefore } from 'date-fns';

import { ShareDealOrmMapper } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealOrmMapper';
import { ShareDealQueryRepositoryAdapter } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { FindShareDealCommand } from '../../../src/module/share-deal/application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../src/module/share-deal/application/port/out/dto/ShareDealSortType';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { assertResolvesRight } from '../../fixture';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ShareDealQueryRepositoryAdapter', () => {
  let shareDealRepositoryAdapter: ShareDealQueryRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareDealQueryRepositoryAdapter, PrismaService],
    }).compile();

    shareDealRepositoryAdapter = module.get(ShareDealQueryRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.shareDeal.deleteMany()]));

  describe('find', () => {
    it('검색어를 포함하는 공유딜을 가져온다', async () => {
      // given
      const matched = ShareDealFactory.createOpen({
        title: 'sample title deal',
      });
      const notMatched = ShareDealFactory.createOpen({ title: 'not matched' });
      await prisma.shareDeal.createMany({
        data: [
          ShareDealOrmMapper.toOrm(matched),
          ShareDealOrmMapper.toOrm(notMatched),
        ],
      });
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.LATEST,
        size: 5,
        keyword: 'title',
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(1);
        expect(value[0].title).toBe(matched.title);
      });
    });

    it('등록순으로 정렬한다', async () => {
      // given
      const now = new Date();
      await Promise.all(
        Array.from({ length: 5 }, (_, index) =>
          prisma.shareDeal.create({
            data: ShareDealOrmMapper.toOrm(
              ShareDealFactory.createOpen({ createdAt: addDays(now, index) }),
            ),
          }),
        ),
      );
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.LATEST,
        size: 5,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(5);
        const actual = value.map((v) => v.createdAt);
        expect(actual).toStrictEqual([...actual].sort(compareDesc));
      });
    });

    it('cursor 이전의 항목만 가져온다', async () => {
      // given
      const now = new Date();
      const deals = await Promise.all(
        Array.from({ length: 5 }, (_, index) =>
          prisma.shareDeal.create({
            data: ShareDealOrmMapper.toOrm(
              ShareDealFactory.createOpen({ createdAt: addDays(now, index) }),
            ),
          }),
        ),
      );
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.LATEST,
        cursor: deals[2].createdAt,
        size: 5,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(2);
        value.forEach((v) => {
          expect(isBefore(v.createdAt, deals[2].createdAt)).toBe(true);
        });
      });
    });

    it('주어진 카테고리에 해당하는 공유딜만 가져온다', async () => {
      // given
      const matched = ShareDealFactory.createOpen({
        category: FoodCategory.KOREAN,
      });
      const notMatched = ShareDealFactory.createOpen({
        category: FoodCategory.AMERICAN,
      });
      await prisma.shareDeal.createMany({
        data: [
          ShareDealOrmMapper.toOrm(matched),
          ShareDealOrmMapper.toOrm(notMatched),
        ],
      });
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.LATEST,
        size: 5,
        category: FoodCategory.KOREAN,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(1);
        expect(value[0].category).toBe(matched.category);
      });
    });

    it('오픈 상태인 공유딜만 가져온다', async () => {
      // given
      await prisma.shareDeal.createMany({
        data: [
          ShareDealFactory.createOpen(),
          ShareDealFactory.create({ status: ShareDealStatus.START }),
          ShareDealFactory.create({ status: ShareDealStatus.CLOSE }),
          ShareDealFactory.create({ status: ShareDealStatus.END }),
        ].map(ShareDealOrmMapper.toOrm),
      });
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.LATEST,
        size: 5,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(1);
        expect(value[0].status).toBe(ShareDealStatus.OPEN);
      });
    });
  });

  describe('findByStatus', () => {
    it('주어진 상태에 대한 공유딜이 없으면 0을 반환한다', async () => {
      // given
      const userId = faker.database.mongodbObjectId();

      // when
      const result = shareDealRepositoryAdapter.countByStatus(
        userId,
        ShareDealStatus.OPEN,
      );

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toBe(0);
      });
    });

    it('내가 만든 완료상태인 공유딜 개수를 가져온다', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.shareDeal.createMany({
        data: [
          ShareDealStatus.START,
          ShareDealStatus.CLOSE,
          ShareDealStatus.END,
          ShareDealStatus.END,
        ]
          .map((status) => ShareDealFactory.create({ status, ownerId: userId }))
          .map(ShareDealOrmMapper.toOrm),
      });

      // when
      const result = shareDealRepositoryAdapter.countByStatus(
        userId,
        ShareDealStatus.END,
      );

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toBe(2);
      });
    });

    it('내가 참여한 오픈된 공유딜 개수를 가져온다 ', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.shareDeal.createMany({
        data: [
          ShareDealStatus.OPEN,
          ShareDealStatus.OPEN,
          ShareDealStatus.CLOSE,
          ShareDealStatus.END,
        ]
          .map((status) =>
            ShareDealFactory.create({ status, participantIds: [userId] }),
          )
          .map(ShareDealOrmMapper.toOrm),
      });

      // when
      const result = shareDealRepositoryAdapter.countByStatus(
        userId,
        ShareDealStatus.OPEN,
      );

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toBe(2);
      });
    });
  });
});
