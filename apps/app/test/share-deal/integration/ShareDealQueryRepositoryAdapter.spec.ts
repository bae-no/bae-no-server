import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { addDays, compareDesc } from 'date-fns';

import { ShareDealOrmMapper } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealOrmMapper';
import { ShareDealQueryRepositoryAdapter } from '../../../src/module/share-deal/adapter/out/persistence/ShareDealQueryRepositoryAdapter';
import { FindByUserShareDealCommand } from '../../../src/module/share-deal/application/port/out/dto/FindByUserShareDealCommand';
import { FindShareDealByNearestCommand } from '../../../src/module/share-deal/application/port/out/dto/FindShareDealByNearestCommand';
import { FindShareDealCommand } from '../../../src/module/share-deal/application/port/out/dto/FindShareDealCommand';
import { ShareDealSortType } from '../../../src/module/share-deal/application/port/out/dto/ShareDealSortType';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { ShareZone } from '../../../src/module/share-deal/domain/vo/ShareZone';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture/utils';

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
    it('주어진 페이지에 해당하는 공유딜을 가져온다', async () => {
      // given
      const id = faker.database.mongodbObjectId();
      await prisma.shareDeal.createMany({
        data: Array.from({ length: 10 }, (_, index) =>
          ShareDealOrmMapper.toOrm(
            ShareDealFactory.createOpen({
              participantInfo: ParticipantInfo.of(
                new Array(index).fill(id),
                10,
              ),
            }),
          ),
        ),
      });
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.POPULAR,
        page: 1,
        size: 3,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (deals) => {
        expect(deals.map((deal) => deal.participantInfo.current)).toEqual([
          6, 5, 4,
        ]);
      });
    });

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
      await prisma.shareDeal.createMany({
        data: Array.from({ length: 5 }, (_, index) =>
          ShareDealOrmMapper.toOrm(
            ShareDealFactory.createOpen({ createdAt: addDays(now, index) }),
          ),
        ),
      });
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

    it('입장가능순으로 정렬한다', async () => {
      // given
      const id = faker.database.mongodbObjectId();
      await prisma.shareDeal.createMany({
        data: Array.from({ length: 10 }, (_, index) =>
          ShareDealOrmMapper.toOrm(
            ShareDealFactory.createOpen({
              participantInfo: ParticipantInfo.of(
                new Array(10).fill(id),
                10 + index,
              ),
            }),
          ),
        ),
      });
      const dto = FindShareDealCommand.of({
        sortType: ShareDealSortType.PARTICIPANTS,
        page: 2,
        size: 2,
      });

      // when
      const result = shareDealRepositoryAdapter.find(dto);

      // then
      await assertResolvesRight(result, (deals) => {
        expect(deals.map((deal) => deal.participantInfo.remaining)).toEqual([
          5, 4,
        ]);
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

    it('오픈 또는 시작 상태인 공유딜만 가져온다', async () => {
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
        expect(value).toHaveLength(2);
        const result = value.every((v) =>
          [ShareDealStatus.OPEN, ShareDealStatus.START].includes(v.status),
        );
        expect(result).toBe(true);
      });
    });
  });

  describe('findByNearest', () => {
    beforeAll(async () => {
      await prisma.$runCommandRaw({
        createIndexes: 'ShareDeal',
        indexes: [
          {
            key: { 'zone.coordinate': '2dsphere' },
            name: 'zoneIndex',
          },
        ],
      });
    });

    it('주어진 거리와 가까운 순으로 정렬한다', async () => {
      // given
      await prisma.shareDeal.createMany({
        data: [
          ShareDealFactory.createOpen({
            zone: new ShareZone('yohan', 'detail', 37.566998, 127.066402),
          }),
          ShareDealFactory.createOpen({
            zone: new ShareZone('int', 'detail', 37.3418754, 126.9744649),
          }),
          ShareDealFactory.createOpen({
            zone: new ShareZone('haru', 'detail', 37.366278237, 127.1118002),
          }),
        ].map(ShareDealOrmMapper.toOrm),
      });
      const dto = FindShareDealByNearestCommand.of({
        latitude: 37.4003408,
        longitude: 127.1067104,
        size: 5,
      });

      // when
      const result = shareDealRepositoryAdapter.findByNearest(dto);

      // then
      await assertResolvesRight(result, (value) => {
        const roads = value.map((v) => v.zone.road);
        const nearRoads = ['haru', 'int', 'yohan'];
        expect(roads).toStrictEqual(nearRoads);
      });
    });

    it('오픈 또는 시작 상태인 공유딜만 가져온다', async () => {
      // given
      await prisma.shareDeal.createMany({
        data: [
          ShareDealFactory.createOpen(),
          ShareDealFactory.create({ status: ShareDealStatus.START }),
          ShareDealFactory.create({ status: ShareDealStatus.CLOSE }),
          ShareDealFactory.create({ status: ShareDealStatus.END }),
        ].map(ShareDealOrmMapper.toOrm),
      });
      const dto = FindShareDealByNearestCommand.of({
        latitude: 45,
        longitude: 123,
        size: 5,
      });

      // when
      const result = shareDealRepositoryAdapter.findByNearest(dto);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(2);
        const result = value.every((v) =>
          [ShareDealStatus.OPEN, ShareDealStatus.START].includes(v.status),
        );
        expect(result).toBe(true);
      });
    });
  });

  describe('countByStatus', () => {
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

    it('내가 만든 공유딜 개수를 가져온다', async () => {
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

    it('내가 참여한 공유딜 개수를 가져온다', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.shareDeal.create({
        data: ShareDealOrmMapper.toOrm(
          ShareDealFactory.create({
            status: ShareDealStatus.END,
            participantInfo: ParticipantInfo.of([userId], 10),
          }),
        ),
      });

      // when
      const result = shareDealRepositoryAdapter.countByStatus(
        userId,
        ShareDealStatus.END,
      );

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toBe(1);
      });
    });
  });

  describe('findById', () => {
    it('조회한 공유딜이 없는 경우 NotFoundException을 반환한다.', async () => {
      // given
      const userId = faker.database.mongodbObjectId();

      // when
      const result = shareDealRepositoryAdapter.findById(userId);

      // then
      await assertResolvesLeft(result, (value) => {
        expect(value).toBeInstanceOf(NotFoundException);
      });
    });

    it('공유딜을 조회한다.', async () => {
      // given
      const shareDeal = await prisma.shareDeal.create({
        data: ShareDealOrmMapper.toOrm(ShareDealFactory.create()),
      });

      // when
      const result = shareDealRepositoryAdapter.findById(shareDeal.id);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.id).toBe(shareDeal.id);
      });
    });
  });

  describe('findByUser', () => {
    it('참여하지 않은 공유딜은 조회되지 않는다.', async () => {
      // given
      await prisma.shareDeal.create({
        data: ShareDealOrmMapper.toOrm(
          ShareDealFactory.create({ status: ShareDealStatus.OPEN }),
        ),
      });

      const command = new FindByUserShareDealCommand(
        faker.database.mongodbObjectId(),
        ShareDealStatus.OPEN,
      );

      // when
      const result = shareDealRepositoryAdapter.findByUser(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(0);
      });
    });

    it('지정된 상태가 아닌 공유딜의 경우 참여 여부와 상관없이 조회되지 않는다.', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.shareDeal.create({
        data: ShareDealOrmMapper.toOrm(
          ShareDealFactory.create({
            status: ShareDealStatus.START,
            participantInfo: ParticipantInfo.of([userId], 3),
          }),
        ),
      });

      const command = new FindByUserShareDealCommand(
        userId,
        ShareDealStatus.OPEN,
      );

      // when
      const result = shareDealRepositoryAdapter.findByUser(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(0);
      });
    });

    it('참여중인 공유딜 중에서 지정된 상태의 공유딜 목록을 조회한다.', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.shareDeal.create({
        data: ShareDealOrmMapper.toOrm(
          ShareDealFactory.create({
            status: ShareDealStatus.START,
            participantInfo: ParticipantInfo.of([userId], 3),
          }),
        ),
      });

      const command = new FindByUserShareDealCommand(
        userId,
        ShareDealStatus.START,
      );

      // when
      const result = shareDealRepositoryAdapter.findByUser(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value).toHaveLength(1);
      });
    });
  });
});
