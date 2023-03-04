import { PrismaService } from '@app/prisma/PrismaService';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserOrmMapper } from '../../../src/module/user/adapter/out/persistence/UserOrmMapper';
import { UserRepositoryAdapter } from '../../../src/module/user/adapter/out/persistence/UserRepositoryAdapter';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { assertResolvesSuccess } from '../../fixture/utils';

describe('UserRepositoryAdapter', () => {
  const prisma = new PrismaService();
  const userRepositoryAdapter = new UserRepositoryAdapter(prisma);

  beforeEach(async () => {
    await prisma.$transaction([prisma.user.deleteMany()]);
  });

  describe('save', () => {
    it('주어진 사용자를 생성한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);

      // when
      const result = userRepositoryAdapter.save(user);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.id).toBeTruthy();
        expect(value.auth).toStrictEqual(auth);
      });
    });

    it('주어진 사용자를 수정한다', async () => {
      // given
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const newUser = await prisma.user
        .create({ data: UserOrmMapper.toOrm(User.byAuth(auth)) })
        .then(UserOrmMapper.toDomain);
      newUser.updateProfile('new introduction');

      // when
      const result = userRepositoryAdapter.save(newUser);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.id).toBe(newUser.id);
        expect(value.profile.introduce).toStrictEqual('new introduction');
      });
    });
  });
});
