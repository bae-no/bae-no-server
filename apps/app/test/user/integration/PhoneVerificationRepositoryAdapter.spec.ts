import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { PhoneVerificationRepositoryAdapter } from '../../../src/module/user/adapter/out/persistence/PhoneVerificationRepositoryAdapter';
import { PhoneVerification } from '../../../src/module/user/domain/PhoneVerification';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';

describe('PhoneVerificationRepositoryAdapter', () => {
  let phoneVerificationRepositoryAdapter: PhoneVerificationRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneVerificationRepositoryAdapter, PrismaService],
    }).compile();

    phoneVerificationRepositoryAdapter = module.get(
      PhoneVerificationRepositoryAdapter,
    );
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () =>
    prisma.$transaction([prisma.phoneVerification.deleteMany()]),
  );

  describe('save', () => {
    it('주어진 인증번호를 생성한다', async () => {
      // given
      const phoneVerification = PhoneVerification.of('01011112222');

      // when
      const result = phoneVerificationRepositoryAdapter.save(
        faker.database.mongodbObjectId(),
        phoneVerification,
      );

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.phoneNumber).toBe(phoneVerification.phoneNumber);
      });
    });
  });

  describe('findLatest', () => {
    it('주어진 사용자에 대한 인증번호가 없으면 에러가 발생한다', async () => {
      // given
      const userId = faker.database.mongodbObjectId();

      // when
      const result = phoneVerificationRepositoryAdapter.findLatest(userId);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err).toStrictEqual(
          new NotFoundException(
            `인증번호가 존재하지 않습니다: userId=${userId}`,
          ),
        );
      });
    });

    it('주어진 사용자에 대한 가장 최근 인증번호를 가져온다', async () => {
      // given
      const userId = faker.database.mongodbObjectId();
      await prisma.phoneVerification.create({
        data: {
          phoneNumber: '01011112222',
          code: '1234',
          expiredAt: new Date(),
          userId,
        },
      });
      await prisma.phoneVerification.create({
        data: {
          phoneNumber: '01011112222',
          code: '5678',
          expiredAt: new Date(),
          userId,
        },
      });

      // when
      const result = phoneVerificationRepositoryAdapter.findLatest(userId);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.code).toBe('5678');
      });
    });
  });
});
