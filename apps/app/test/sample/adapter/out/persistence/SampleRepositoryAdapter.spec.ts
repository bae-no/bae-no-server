import { PrismaService } from '@app/prisma/PrismaService';
import { Test, TestingModule } from '@nestjs/testing';

import { SampleRepositoryAdapter } from '../../../../../src/module/sample/adapter/out/persistence/SampleRepositoryAdapter';
import { Sample } from '../../../../../src/module/sample/domain/Sample';
import { assertResolvesRight } from '../../../../fixture';

describe('SampleRepositoryAdapter', () => {
  let sampleRepositoryAdapter: SampleRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SampleRepositoryAdapter, PrismaService],
    }).compile();

    sampleRepositoryAdapter = module.get(SampleRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.sample.deleteMany()]));

  describe('save', () => {
    it('주어진 샘플을 생성한다', async () => {
      // given
      const sample = Sample.of({
        email: 'email',
        name: 'name',
      });

      // when
      const result = sampleRepositoryAdapter.save(sample);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.id).not.toBeUndefined();
        expect(value.name).toEqual(sample.name);
        expect(value.email).toEqual(sample.email);
      });
    });
  });
});
