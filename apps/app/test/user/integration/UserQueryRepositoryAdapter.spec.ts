import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { UserOrmMapper } from '../../../src/module/user/adapter/out/persistence/UserOrmMapper';
import { UserQueryRepositoryAdapter } from '../../../src/module/user/adapter/out/persistence/UserQueryRepositoryAdapter';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import {
  assertNone,
  assertResolvesLeft,
  assertResolvesRight,
  assertSome,
} from '../../fixture/utils';

describe('UserQueryRepositoryAdapter', () => {
  let userQueryRepositoryAdapter: UserQueryRepositoryAdapter;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQueryRepositoryAdapter, PrismaService],
    }).compile();

    userQueryRepositoryAdapter = module.get(UserQueryRepositoryAdapter);
    prisma = module.get(PrismaService);
  });

  afterAll(async () => prisma.$disconnect());

  beforeEach(async () => prisma.$transaction([prisma.user.deleteMany()]));

  describe('findByAuth', () => {
    it('auth 를 가진 유저가 존재하지 않으면 none 을 반환한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);

      // when
      const result = userQueryRepositoryAdapter.findByAuth(auth);

      // then
      await assertResolvesRight(result, (value) => {
        assertNone(value);
      });
    });

    it('auth 를 가진 유저를 반환한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      await prisma.user.create({
        data: UserOrmMapper.toOrm(User.byAuth(auth)),
      });

      // when
      const result = userQueryRepositoryAdapter.findByAuth(auth);

      // then
      await assertResolvesRight(result, (value) => {
        assertSome(value, (user) => {
          expect(user.auth).toStrictEqual(auth);
        });
      });
    });
  });

  describe('findById', () => {
    it('id 를 가진 유저가 존재하지 않으면 에러를 반환한다', async () => {
      // given
      const id = faker.database.mongodbObjectId();

      // when
      const result = userQueryRepositoryAdapter.findById(id);

      // then
      await assertResolvesLeft(result, (err) => {
        expect(err).toBeInstanceOf(NotFoundException);
      });
    });

    it('id 를 가진 유저를 반환한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = await prisma.user.create({
        data: UserOrmMapper.toOrm(User.byAuth(auth)),
      });

      // when
      const result = userQueryRepositoryAdapter.findById(user.id);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.id).toBe(user.id);
      });
    });
  });

  describe('findByNickname', () => {
    it('닉네임을 가진 유저가 존재하지 않으면 none 을 반환한다', async () => {
      // given
      const nickname = 'nickname';

      // when
      const result = userQueryRepositoryAdapter.findByNickname(nickname);

      // then
      await assertResolvesRight(result, (value) => {
        assertNone(value);
      });
    });

    it('닉네임을 가진 유저가 존재하면 some 을 반환한다', async () => {
      // given
      const user = await prisma.user.create({
        data: {
          ...UserOrmMapper.toOrm(
            User.byAuth(new Auth('socialId', AuthType.GOOGLE)),
          ),
          nickname: 'nickname',
        },
      });

      // when
      const result = userQueryRepositoryAdapter.findByNickname(user.nickname);

      // then
      await assertResolvesRight(result, (value) => {
        assertSome(value, (user) => {
          expect(user.nickname).toBe(user.nickname);
        });
      });
    });
  });
});
