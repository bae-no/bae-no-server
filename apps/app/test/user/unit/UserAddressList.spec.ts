import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { Address } from '../../../src/module/user/domain/vo/Address';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { UserAddressList } from '../../../src/module/user/domain/vo/UserAddressList';

describe('UserAddressList', () => {
  describe('append', () => {
    it('기존 주소가 5개 이하라면 주소를 추가한다', () => {
      // given
      const list = UserAddressList.of([
        createAddress(),
        createAddress(),
        createAddress(),
        createAddress(),
        createAddress(),
      ]);

      // when
      const result = list.append(createAddress());

      // then
      expect(result.count).toBe(6);
    });

    it('기존 주소가 6개면 에러가 발생한다', () => {
      // given
      const list = UserAddressList.of([
        createAddress(),
        createAddress(),
        createAddress(),
        createAddress(),
        createAddress(),
        createAddress(),
      ]);

      // when
      const result = () => list.append(createAddress());

      // then
      expect(result).toThrowError('주소는 최대 6개까지 등록할 수 있습니다.');
    });

    it('집주소가 이미 존재하는데 집주소를 추가로 제공하면 기존 항목이 삭제된다', () => {
      // given
      const list = UserAddressList.of([createAddress(AddressType.HOME)]);

      // when
      const result = list.append(createAddress(AddressType.HOME, 'new name'));

      // then
      expect(result.count).toBe(1);
      expect(result.find(0)?.alias).toBe('new name');
    });

    it('회사주소가 아미 존재하는데 회사주소를 추가로 제공하면 기존 항목이 삭제된다', () => {
      // given
      const list = UserAddressList.of([createAddress(AddressType.WORK)]);

      // when
      const result = list.append(createAddress(AddressType.WORK, 'new name'));

      // then
      expect(result.count).toBe(1);
      expect(result.find(0)?.alias).toBe('new name');
    });
  });

  function createAddress(type = AddressType.ETC, alias?: string) {
    return new Address(
      alias ?? faker.lorem.word(),
      AddressSystem.JIBUN,
      'path',
      'detail',
      type,
      10,
      20,
    );
  }
});
