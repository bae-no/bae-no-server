import { PrismaService } from '@app/prisma/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';

import { SampleQueryRepositoryAdapter } from '../../../src/module/sample/adapter/out/persistence/SampleQueryRepositoryAdapter';
import { assertNone, assertResolvesRight, assertSome } from '../../fixture';

describe('SampleQueryRepositoryAdapter', () => {
  let sampleQueryRepositoryAdapter: SampleQueryRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SampleQueryRepositoryAdapter, PrismaService],
    }).compile();

    sampleQueryRepositoryAdapter = module.get(SampleQueryRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.sample.deleteMany()]));

  describe('findById', () => {
    it('존재하지 않는 id 로 요청하면 none 을 반환한다', async () => {
      // given
      const id = '507f191e810c19729de860ea';

      // when
      const result = sampleQueryRepositoryAdapter.findById(id);

      // then
      await assertResolvesRight(result, (value) => {
        assertNone(value);
      });
    });

    it('존재하는 데이터를 가져온다', async () => {
      // given
      const createdSample = await prisma.sample.create({
        data: { name: 'name', email: 'email' },
      });

      // when
      const result = sampleQueryRepositoryAdapter.findById(createdSample.id);

      // then
      await assertResolvesRight(result, (value) => {
        assertSome(value, (sample) => {
          expect(sample.id).toBe(createdSample.id);
        });
      });
    });
  });
});
